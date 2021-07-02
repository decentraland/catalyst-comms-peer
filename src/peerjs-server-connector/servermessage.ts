import { PeerOutgoingMessage } from '../lighthouse-protocol/messages'
import { ServerMessageType } from './enums'

export type ServerMessage =
  | {
      type: ServerMessageType
      payload: any
      src: string
      dst: string
    }
  | PeerOutgoingMessage
