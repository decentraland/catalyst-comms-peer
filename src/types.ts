import SimplePeer from 'simple-peer'
import { Position3D } from './utils/Positions'
import { SocketBuilder } from './peerjs-server-connector/socket'
import { Packet } from './proto/peer_protobuf'
import { ValidationMessagePayload } from './peerjs-server-connector/peerjsserverconnection'

type PacketSubtypeData = {
  lastTimestamp: number
  lastSequenceId: number
}
export type PeerRelay = { id: string; hops: number; timestamp: number }

export type KnownPeerData = {
  id: string
  lastUpdated?: number // Local timestamp used for registering if the peer is alive
  timestamp?: number // Their local timestamp used for handling packets
  subtypeData: Record<string, PacketSubtypeData>
  position?: Position3D
  latency?: number
  hops?: number
  reachableThrough: Record<string, PeerRelay>
}

export type MinPeerData = { id: string; position?: Position3D }

export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  NONE = Number.MAX_SAFE_INTEGER
}

export type LogLevelString = keyof typeof LogLevel

export type PingResult = {
  peerId: string
  latency: number
}

export type WebRTCProvider = {
  RTCPeerConnection: any
  RTCSessionDescription: any
  RTCIceCandidate: any
}

export type ValidationResult = {
  ok: boolean
  message?: string
}

export type AuthHandler = (msg: string) => Promise<ValidationMessagePayload>

export type PeerConfig = {
  connectionConfig?: any
  wrtc?: any
  socketBuilder?: SocketBuilder
  token?: string
  sessionId?: string
  targetConnections?: number
  maxConnections?: number
  peerConnectTimeout?: number
  oldConnectionsTimeout?: number
  messageExpirationTime?: number
  logLevel?: LogLevelString
  reconnectionAttempts?: number
  backoffMs?: number
  authHandler?: AuthHandler
  positionConfig?: PositionConfig
  statsUpdateInterval?: number
  /**
   * If not set, the peer won't execute pings regularly.
   * Keep in mind that the peer won't execute two pings at the same time.
   * Effective interval is actually pingInterval + pingTimeout
   */
  pingInterval?: number
  pingTimeout?: number

  /**
   * If not set, suspensions won't be requested.
   */
  relaySuspensionConfig?: RelaySuspensionConfig
  heartbeatInterval?: number

  eventsHandler?: PeerEventsHandler
}

export type PeerEventsHandler = {
  statusHandler?: (status: PeerStatus) => void
  onIslandChange?: (islandId: string | undefined, peers: MinPeerData[]) => any
  onPeerLeftIsland?: (peerId: string) => any
  onPeerJoinedIsland?: (peerId: string) => any
}

export type RelaySuspensionConfig = {
  /**
   * Interval to send relay suspension control messages to other peers.
   */
  relaySuspensionInterval: number
  /**
   * Duration of the suspension
   */
  relaySuspensionDuration: number
}

export type PositionConfig = {
  selfPosition: () => Position3D | undefined
  distance?: (l1: Position3D, l2: Position3D) => number
  nearbyPeersDistance?: number
  /** Maximum distance for selecting connection candidates*/

  maxConnectionDistance?: number
  /** Distance for which peers will be disconnected when updating network. It should be greater than maxConnectionDistance.
   * If not specified, connections will not be dropped by distance*/

  disconnectDistance?: number
}

export type PacketCallback = (sender: string, room: string, payload: any, packet: Packet) => void

export type ReceivedRelayData = {
  hops: number
  total: number
  discarded: number
}

export type ConnectedPeerData = {
  id: string
  sessionId: string
  initiator: boolean
  createTimestamp: number
  connection: SimplePeer.Instance
}

export type PeerRelayData = {
  lastRelaySuspensionTimestamp?: number
  /**
   * This is data for relays received from this peer
   */
  receivedRelayData: Record<string, ReceivedRelayData>
  /**
   * This is suspension data for relays sent by this peer
   * Example: A requests suspension of P to B ==> B stores that suspension in ownSuspendedRelays in the connection data of their connection
   * key = source peer id. Value = suspension expiration
   * */
  ownSuspendedRelays: Record<string, number>

  /**
   * These are suspensions requested to this peer, tracked by the local peer
   * Example: A requests suspension of P to B ==> A stores that suspension in theirSuspendedRelays in the connection data of their connection
   * key = source peer id. Value = suspension expiration
   * */
  theirSuspendedRelays: Record<string, number>

  /**
   * Suspension requests to be sent to this peer by the local peer in the next window.
   * Is the list of the ids of the relayed peers for which to suspend relay
   */
  pendingSuspensionRequests: string[]
}

export type PeerStatus = 'reconnection-error' | 'id-taken'
