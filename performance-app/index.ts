import { performance } from 'perf_hooks'
;(global as any).WebSocket = require('ws')
;(global as any).performance = performance
global.window = {} as any

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Reader } from 'protobufjs'
import {
  Peer,
  buildCatalystPeerStatsData,
  GlobalStats,
  PeerConfig,
  Position3D,
  PeerMessageTypes
} from '@dcl/catalyst-peer'
import { ChatData, CommsMessage, PositionData, ProfileData } from './messages/messages'
import fetch from 'node-fetch'
import wrtc from 'wrtc'

type Quaternion = [number, number, number, number]

const numberOfPeers = parseInt(process.env.NUMBER_OF_PEERS ?? '2')
const testDuration = parseInt(process.env.TEST_DURATION ?? '3600') * 1000
const statsSubmitInterval = parseInt(process.env.STATS_SUBMIT_INTERVAL ?? '2000')
const lighthouseUrl = process.env.LIGHTHOUSE_URL ?? 'http://localhost:9000'
const statsServerUrl = process.env.STATS_SERVER_URL ?? 'http://localhost:4000'
const testId = process.env.TEST_ID
const pingInterval = parseInt(process.env.PING_INTERVAL ?? '200')

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function generateToken(n: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let token = ''
  for (let i = 0; i < n; i++) {
    token += chars[Math.floor(Math.random() * chars.length)]
  }
  return token
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

if (!testId) {
  console.error('Missing parameter testId! No results will be submited to stats server')
}

let metrics = {}
const peerIds: string[] = []

type Routine = (elapsed: number, delta: number, peer: SimulatedPeer) => Promise<void> | void

const timeBetweenPositionMessages = 100
const timeBetweenProfileMessages = 1000
const timeBetweenChatMessages = 10000

let elapsed = 0

function testOngoing() {
  return elapsed <= testDuration
}

function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function createPositionData(p: Position3D, q: Quaternion) {
  const positionData = PositionData.fromPartial({
    positionX: p[0],
    positionY: p[1],
    positionZ: p[2],
    rotationX: q[0],
    rotationY: q[1],
    rotationZ: q[2],
    rotationW: q[3]
  })
  return positionData
}

function createProfileData(peerId: string) {
  const positionData = ProfileData.fromPartial({
    userId: peerId,
    profileVersion: '1'
  })
  return positionData
}

function createChatData(peerId: string) {
  const chatData = ChatData.fromPartial({
    messageId: uuid(),
    text: generateToken(40)
  })
  return chatData
}

function createAndEncodeCommsMessage(data: PositionData | ProfileData | ChatData, dataKey: keyof CommsMessage) {
  const commsMessage = CommsMessage.fromPartial({
    time: Date.now(),
    [dataKey]: data
  })

  return CommsMessage.encode(commsMessage).finish()
}

function average(numbers: number[]) {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length
}

class PeriodicAction {
  private elapsed: number = 0
  constructor(private period: number, private action: (elapsed, delta, peer) => void) {}

  update(elapsed: number, delta: number, peer: SimulatedPeer) {
    this.elapsed += delta
    if (this.elapsed > this.period) {
      this.elapsed = 0
      this.action(elapsed, delta, peer)
    }
  }
}

function runLoops(startingPosition: Position3D, speed: number = 5): Routine {
  const periodicPosition = new PeriodicAction(timeBetweenPositionMessages, (a, b, peer: SimulatedPeer) => {
    peer.peer.sendMessage(
      'room',
      createAndEncodeCommsMessage(createPositionData(peer.position, peer.rotation), 'positionData'),
      PeerMessageTypes.unreliable('position')
    )
  })

  const periodicProfile = new PeriodicAction(timeBetweenProfileMessages, (a, b, peer) => {
    peer.peer.sendMessage(
      'room',
      createAndEncodeCommsMessage(createProfileData(peer.peer.peerId), 'profileData'),
      PeerMessageTypes.unreliable('profile')
    )
  })

  const periodicChat = new PeriodicAction(timeBetweenChatMessages, (a, b, peer) => {
    peer.peer.sendMessage(
      'room',
      createAndEncodeCommsMessage(createChatData(peer), 'chatData'),
      PeerMessageTypes.reliable('chat')
    )
  })

  return (elapsed, delta, peer) => {
    //TODO: Move the peer
    periodicPosition.update(elapsed, delta, peer)
    periodicProfile.update(elapsed, delta, peer)
    periodicChat.update(elapsed, delta, peer)
  }
}

function testStarted() {
  let started = false
  let timedout = false
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!started) {
        timedout = true
        reject('Timed out waiting for test to start')
      }
    }, 600 * 1000)

    const checkTestStarted = async () => {
      try {
        const testStartedResponse = await fetch(`${statsServerUrl}/test/${testId}`)
        if (testStartedResponse.status === 200) {
          const responseJson = await testStartedResponse.json()
          if (responseJson.started) {
            started = true
            resolve(undefined)
          }
        }
      } catch (e) {
        console.warn('Error checking if test started', e)
      }

      if (!started && !timedout) {
        console.log('Awaiting for test to be started...')
        setTimeout(checkTestStarted, 3000)
      }
    }

    checkTestStarted()
  })
}

type SimulatedPeer = {
  position: Position3D
  rotation: Quaternion
  peer: Peer
  routine: Routine
}

const PARCEL_SIZE = 16

const peerConfig: PeerConfig = {
  connectionConfig: {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302'
      },
      {
        urls: 'stun:stun2.l.google.com:19302'
      },
      {
        urls: 'stun:stun3.l.google.com:19302'
      },
      {
        urls: 'stun:stun4.l.google.com:19302'
      },
      {
        urls: 'turn:stun.decentraland.org:3478',
        credential: 'passworddcl',
        username: 'usernamedcl'
      }
    ]
  },
  pingInterval,
  authHandler: (msg) => Promise.resolve(msg),
  logLevel: 'NONE',
  wrtc
}

function generatePosition(): Position3D {
  // For now the positions are generated randomly in a 4 by 4 parcel range
  const randomComponent = () => randomBetween(-2 * PARCEL_SIZE, 2 * PARCEL_SIZE)
  return [randomComponent(), 0, randomComponent()]
}

async function submitStats(peer: SimulatedPeer, stats: GlobalStats) {
  const statsToSubmit = buildCatalystPeerStatsData(peer.peer)

  if (statsServerUrl && testId) {
    console.log(`${testId}-peer-${peer.peer.peerId}-metrics-${Date.now()}`, JSON.stringify(statsToSubmit, null, 4))
    // writeFileSync(
    //   `${testId}-peer-${peer.peer.peerId}-metrics-${Date.now()}.log`,
    //   JSON.stringify(statsToSubmit, null, 4)
    // )
    // await fetch(`${statsServerUrl}/test/${testId}/peer/${peer.peer.peerId}/metrics`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(statsToSubmit)
    // })
  }
}

async function retry(promiseCreator: () => Promise<any>, retries: number = 5, attempts: number = 0) {
  try {
    await promiseCreator()
  } catch (e) {
    if (attempts < retries) {
      await retry(promiseCreator, retries, attempts + 1)
    } else {
      throw e
    }
  }
}

export async function createPeer() {
  const position = generatePosition()

  const simulatedPeer: SimulatedPeer = {
    position: generatePosition(),
    rotation: [0, 0, 0, 0],
    peer: new Peer(
      lighthouseUrl,
      undefined,
      (sender, room, payload: Uint8Array) => {
        const message = CommsMessage.decode(Reader.create(payload))

        if (message.positionData) {
          simulatedPeer.peer.setPeerPosition(sender, [
            message.positionData.positionX,
            message.positionData.positionY,
            message.positionData.positionZ
          ])
        }
      },
      {
        ...peerConfig,
        statsUpdateInterval: statsSubmitInterval,
        positionConfig: {
          selfPosition: () => simulatedPeer.position
        }
      }
    ),
    routine: runLoops(position)
    // routine: asyncRunLoops
  }

  await simulatedPeer.peer.awaitConnectionEstablished()

  await retry(async () => {
    await simulatedPeer.peer.joinRoom('room')
  })

  simulatedPeer.peer.stats.onPeriodicStatsUpdated = (stats) => {
    if (testOngoing())
      submitStats(simulatedPeer, stats).catch((e) => console.error('Error submiting stats to server', e))
  }

  const peerId = simulatedPeer.peer.peerId

  peerIds.push(peerId as any)

  return simulatedPeer
}

;(async () => {
  if (testId) {
    await testStarted()
  }

  let lastTickStamp: number | undefined
  const peers: SimulatedPeer[] = await Promise.all(
    [...new Array(numberOfPeers).keys()].map(async () => {
      await sleep(Math.random() * 5000)
      return createPeer()
    })
  )

  function tick() {
    const timestamp = performance.now()
    const delta = typeof lastTickStamp !== 'undefined' ? timestamp - lastTickStamp : 0

    elapsed += delta
    lastTickStamp = timestamp

    if (testOngoing()) {
      if (delta > 0) {
        peers.forEach((it) => it.routine(elapsed, delta, it))
      }
      setTimeout(tick, 16)
    } else {
      // TODO: Submit summary to server
      console.log('Test finished')
    }
  }
  // We delay the first tick a random number to ensure the clients are not in sync
  setTimeout(tick, Math.floor(Math.random() * 3000))

  // We delay the first tick a random number to ensure the clients are not in sync
  setTimeout(tick, Math.floor(Math.random() * 3000))
  function sumForAllPeers(statsKey: string, valueKey: string) {
    return peers.reduce((value, peer) => value + peer.peer.stats[statsKey][valueKey], 0)
  }
  function avgForAllPeers(statsKey: string, valueKey: string) {
    return sumForAllPeers(statsKey, valueKey) / peers.length
  }

  function updateStats() {
    metrics['peers'] = peers.length
    metrics['elapsed'] = (elapsed / 1000).toFixed(2)
    metrics['sent'] = sumForAllPeers('sent', 'totalPackets')
    metrics['received'] = sumForAllPeers('received', 'totalPackets')
    metrics['relayed'] = sumForAllPeers('relayed', 'totalPackets')
    metrics['receivedpersecond'] = avgForAllPeers('received', 'packetsPerSecond')
    metrics['sentpersecond'] = avgForAllPeers('sent', 'packetsPerSecond')
    metrics['relayedpersecond'] = sumForAllPeers('relayed', 'packetsPerSecond')
    metrics['connected-peers'] = average(peers.map((it) => it.peer.fullyConnectedPeerIds().length))
    // @ts-ignore
    metrics['known-peers'] = average(peers.map((it) => Object.keys(it.peer.knownPeers).length))
    // @ts-ignore
    metrics['latency'] = average(peers.flatMap((it) => Object.values(it.peer.knownPeers).map((kp) => kp.latency)))
    // writeFileSync(`${testId}-metrics-${Date.now()}.json`, JSON.stringify(metrics))
    if (testOngoing()) {
      setTimeout(() => {
        updateStats()
      }, 500)
    }
  }
  updateStats()
})().catch((e) => {
  console.error('Test aborted', e)
})
