/* eslint-disable */
import Long from 'long'
import _m0 from 'protobufjs/minimal'

export const protobufPackage = ''

export interface CommsMessage {
  time: number
  positionData: PositionData | undefined
  profileData: ProfileData | undefined
  chatData: ChatData | undefined
}

export interface PositionData {
  positionX: number
  positionY: number
  positionZ: number
  rotationX: number
  rotationY: number
  rotationZ: number
  rotationW: number
}

export interface ProfileData {
  profileVersion: string
  userId: string
}

export interface ChatData {
  messageId: string
  text: string
}

const baseCommsMessage: object = { time: 0 }

export const CommsMessage = {
  encode(message: CommsMessage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.time !== 0) {
      writer.uint32(9).double(message.time)
    }
    if (message.positionData !== undefined) {
      PositionData.encode(message.positionData, writer.uint32(18).fork()).ldelim()
    }
    if (message.profileData !== undefined) {
      ProfileData.encode(message.profileData, writer.uint32(26).fork()).ldelim()
    }
    if (message.chatData !== undefined) {
      ChatData.encode(message.chatData, writer.uint32(34).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CommsMessage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseCommsMessage } as CommsMessage
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.time = reader.double()
          break
        case 2:
          message.positionData = PositionData.decode(reader, reader.uint32())
          break
        case 3:
          message.profileData = ProfileData.decode(reader, reader.uint32())
          break
        case 4:
          message.chatData = ChatData.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): CommsMessage {
    const message = { ...baseCommsMessage } as CommsMessage
    if (object.time !== undefined && object.time !== null) {
      message.time = Number(object.time)
    } else {
      message.time = 0
    }
    if (object.positionData !== undefined && object.positionData !== null) {
      message.positionData = PositionData.fromJSON(object.positionData)
    } else {
      message.positionData = undefined
    }
    if (object.profileData !== undefined && object.profileData !== null) {
      message.profileData = ProfileData.fromJSON(object.profileData)
    } else {
      message.profileData = undefined
    }
    if (object.chatData !== undefined && object.chatData !== null) {
      message.chatData = ChatData.fromJSON(object.chatData)
    } else {
      message.chatData = undefined
    }
    return message
  },

  toJSON(message: CommsMessage): unknown {
    const obj: any = {}
    message.time !== undefined && (obj.time = message.time)
    message.positionData !== undefined &&
      (obj.positionData = message.positionData ? PositionData.toJSON(message.positionData) : undefined)
    message.profileData !== undefined &&
      (obj.profileData = message.profileData ? ProfileData.toJSON(message.profileData) : undefined)
    message.chatData !== undefined && (obj.chatData = message.chatData ? ChatData.toJSON(message.chatData) : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<CommsMessage>): CommsMessage {
    const message = { ...baseCommsMessage } as CommsMessage
    if (object.time !== undefined && object.time !== null) {
      message.time = object.time
    } else {
      message.time = 0
    }
    if (object.positionData !== undefined && object.positionData !== null) {
      message.positionData = PositionData.fromPartial(object.positionData)
    } else {
      message.positionData = undefined
    }
    if (object.profileData !== undefined && object.profileData !== null) {
      message.profileData = ProfileData.fromPartial(object.profileData)
    } else {
      message.profileData = undefined
    }
    if (object.chatData !== undefined && object.chatData !== null) {
      message.chatData = ChatData.fromPartial(object.chatData)
    } else {
      message.chatData = undefined
    }
    return message
  }
}

const basePositionData: object = {
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
  rotationW: 0
}

export const PositionData = {
  encode(message: PositionData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.positionX !== 0) {
      writer.uint32(13).float(message.positionX)
    }
    if (message.positionY !== 0) {
      writer.uint32(21).float(message.positionY)
    }
    if (message.positionZ !== 0) {
      writer.uint32(29).float(message.positionZ)
    }
    if (message.rotationX !== 0) {
      writer.uint32(37).float(message.rotationX)
    }
    if (message.rotationY !== 0) {
      writer.uint32(45).float(message.rotationY)
    }
    if (message.rotationZ !== 0) {
      writer.uint32(53).float(message.rotationZ)
    }
    if (message.rotationW !== 0) {
      writer.uint32(61).float(message.rotationW)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PositionData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...basePositionData } as PositionData
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.positionX = reader.float()
          break
        case 2:
          message.positionY = reader.float()
          break
        case 3:
          message.positionZ = reader.float()
          break
        case 4:
          message.rotationX = reader.float()
          break
        case 5:
          message.rotationY = reader.float()
          break
        case 6:
          message.rotationZ = reader.float()
          break
        case 7:
          message.rotationW = reader.float()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): PositionData {
    const message = { ...basePositionData } as PositionData
    if (object.positionX !== undefined && object.positionX !== null) {
      message.positionX = Number(object.positionX)
    } else {
      message.positionX = 0
    }
    if (object.positionY !== undefined && object.positionY !== null) {
      message.positionY = Number(object.positionY)
    } else {
      message.positionY = 0
    }
    if (object.positionZ !== undefined && object.positionZ !== null) {
      message.positionZ = Number(object.positionZ)
    } else {
      message.positionZ = 0
    }
    if (object.rotationX !== undefined && object.rotationX !== null) {
      message.rotationX = Number(object.rotationX)
    } else {
      message.rotationX = 0
    }
    if (object.rotationY !== undefined && object.rotationY !== null) {
      message.rotationY = Number(object.rotationY)
    } else {
      message.rotationY = 0
    }
    if (object.rotationZ !== undefined && object.rotationZ !== null) {
      message.rotationZ = Number(object.rotationZ)
    } else {
      message.rotationZ = 0
    }
    if (object.rotationW !== undefined && object.rotationW !== null) {
      message.rotationW = Number(object.rotationW)
    } else {
      message.rotationW = 0
    }
    return message
  },

  toJSON(message: PositionData): unknown {
    const obj: any = {}
    message.positionX !== undefined && (obj.positionX = message.positionX)
    message.positionY !== undefined && (obj.positionY = message.positionY)
    message.positionZ !== undefined && (obj.positionZ = message.positionZ)
    message.rotationX !== undefined && (obj.rotationX = message.rotationX)
    message.rotationY !== undefined && (obj.rotationY = message.rotationY)
    message.rotationZ !== undefined && (obj.rotationZ = message.rotationZ)
    message.rotationW !== undefined && (obj.rotationW = message.rotationW)
    return obj
  },

  fromPartial(object: DeepPartial<PositionData>): PositionData {
    const message = { ...basePositionData } as PositionData
    if (object.positionX !== undefined && object.positionX !== null) {
      message.positionX = object.positionX
    } else {
      message.positionX = 0
    }
    if (object.positionY !== undefined && object.positionY !== null) {
      message.positionY = object.positionY
    } else {
      message.positionY = 0
    }
    if (object.positionZ !== undefined && object.positionZ !== null) {
      message.positionZ = object.positionZ
    } else {
      message.positionZ = 0
    }
    if (object.rotationX !== undefined && object.rotationX !== null) {
      message.rotationX = object.rotationX
    } else {
      message.rotationX = 0
    }
    if (object.rotationY !== undefined && object.rotationY !== null) {
      message.rotationY = object.rotationY
    } else {
      message.rotationY = 0
    }
    if (object.rotationZ !== undefined && object.rotationZ !== null) {
      message.rotationZ = object.rotationZ
    } else {
      message.rotationZ = 0
    }
    if (object.rotationW !== undefined && object.rotationW !== null) {
      message.rotationW = object.rotationW
    } else {
      message.rotationW = 0
    }
    return message
  }
}

const baseProfileData: object = { profileVersion: '', userId: '' }

export const ProfileData = {
  encode(message: ProfileData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.profileVersion !== '') {
      writer.uint32(10).string(message.profileVersion)
    }
    if (message.userId !== '') {
      writer.uint32(18).string(message.userId)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProfileData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseProfileData } as ProfileData
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.profileVersion = reader.string()
          break
        case 2:
          message.userId = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ProfileData {
    const message = { ...baseProfileData } as ProfileData
    if (object.profileVersion !== undefined && object.profileVersion !== null) {
      message.profileVersion = String(object.profileVersion)
    } else {
      message.profileVersion = ''
    }
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = String(object.userId)
    } else {
      message.userId = ''
    }
    return message
  },

  toJSON(message: ProfileData): unknown {
    const obj: any = {}
    message.profileVersion !== undefined && (obj.profileVersion = message.profileVersion)
    message.userId !== undefined && (obj.userId = message.userId)
    return obj
  },

  fromPartial(object: DeepPartial<ProfileData>): ProfileData {
    const message = { ...baseProfileData } as ProfileData
    if (object.profileVersion !== undefined && object.profileVersion !== null) {
      message.profileVersion = object.profileVersion
    } else {
      message.profileVersion = ''
    }
    if (object.userId !== undefined && object.userId !== null) {
      message.userId = object.userId
    } else {
      message.userId = ''
    }
    return message
  }
}

const baseChatData: object = { messageId: '', text: '' }

export const ChatData = {
  encode(message: ChatData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.messageId !== '') {
      writer.uint32(10).string(message.messageId)
    }
    if (message.text !== '') {
      writer.uint32(18).string(message.text)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChatData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseChatData } as ChatData
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.messageId = reader.string()
          break
        case 2:
          message.text = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ChatData {
    const message = { ...baseChatData } as ChatData
    if (object.messageId !== undefined && object.messageId !== null) {
      message.messageId = String(object.messageId)
    } else {
      message.messageId = ''
    }
    if (object.text !== undefined && object.text !== null) {
      message.text = String(object.text)
    } else {
      message.text = ''
    }
    return message
  },

  toJSON(message: ChatData): unknown {
    const obj: any = {}
    message.messageId !== undefined && (obj.messageId = message.messageId)
    message.text !== undefined && (obj.text = message.text)
    return obj
  },

  fromPartial(object: DeepPartial<ChatData>): ChatData {
    const message = { ...baseChatData } as ChatData
    if (object.messageId !== undefined && object.messageId !== null) {
      message.messageId = object.messageId
    } else {
      message.messageId = ''
    }
    if (object.text !== undefined && object.text !== null) {
      message.text = object.text
    } else {
      message.text = ''
    }
    return message
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any
  _m0.configure()
}
