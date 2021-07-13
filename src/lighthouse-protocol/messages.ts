// INCOMING
export enum PeerIncomingMessageType {
  PEER_LEFT_ISLAND = 'PEER_LEFT_ISLAND',
  PEER_JOINED_ISLAND = 'PEER_JOINED_ISLAND',
  OPTIMAL_NETWORK_RESPONSE = 'OPTIMAL_NETWORK_RESPONSE',
  CHANGE_ISLAND = 'CHANGE_ISLAND'
}

export type PeerWithPosition = {
  id: string
  position: [number, number, number]
}

export type ChangeIsland = {
  type: PeerIncomingMessageType.CHANGE_ISLAND
  payload: {
    islandId: string
    peers: PeerWithPosition[]
  }
}

export type PeerJoinedIsland = {
  type: PeerIncomingMessageType.PEER_LEFT_ISLAND
  payload: {
    islandId: string
    peer: PeerWithPosition
  }
}

export type PeerLeftIsland = {
  type: PeerIncomingMessageType.PEER_JOINED_ISLAND
  payload: {
    islandId: string
    peer: PeerWithPosition
  }
}

export type PeerIncomingMessageContent = ChangeIsland | PeerJoinedIsland | PeerLeftIsland

export type PeerIncomingMessage = {
  readonly src: string
  readonly dst: string
} & PeerIncomingMessageContent

// OUTGOING
export enum PeerOutgoingMessageType {
  HEARTBEAT = 'HEARTBEAT'
}

export type HeartbeatMessage = {
  type: PeerOutgoingMessageType.HEARTBEAT
  payload: {
    connectedPeerIds: string[]
    parcel?: [number, number]
    position?: [number, number, number]
    preferedIslandId?: string
  }
}

export type PeerOutgoingMessage = HeartbeatMessage
