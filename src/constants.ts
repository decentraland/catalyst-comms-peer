export const PEER_CONSTANTS = {
  EXPIRATION_LOOP_INTERVAL: 2000,
  KNOWN_PEERS_EXPIRE_TIME: 90000,
  KNOWN_PEER_RELAY_EXPIRE_TIME: 30000,
  OVERCONNECTED_NETWORK_UPDATE_DELAY: 500,
  DEFAULT_OPTIMIZE_NETWORK_INTERVAL: 30000,
  DEFAULT_TTL: 10,
  DEFAULT_PING_TIMEOUT: 7000,
  OLD_POSITION_THRESHOLD: 30000,
  DEFAULT_STATS_UPDATE_INTERVAL: 1000,
  DEFAULT_TARGET_CONNECTIONS: 4,
  DEFAULT_MAX_CONNECTIONS: 7,
  DEFAULT_PEER_CONNECT_TIMEOUT: 3500,
  DEFAULT_MESSAGE_EXPIRATION_TIME: 10000,
  DEFAULT_RECONNECTIONS_ATTEMPTS: 10,
  DEFAULT_RECONNECTION_BACKOFF_MS: 2000,
  DEFAULT_HEARTBEAT_INTERVAL: 2000
}

export const PeerSignals = {
  offer: 'offer',
  answer: 'answer',
  candidate: 'candidate'
}

export enum ConnectionRejectReasons {
  INCOMPATIBLE_PROTOCOL_VERSION = 'INCOMPATIBLE_PROTOCOL_VERSION',
  MUST_BE_IN_SAME_DOMAIN_AND_LAYER = 'MUST_BE_IN_SAME_DOMAIN_AND_LAYER',
  TOO_MANY_CONNECTIONS = 'TOO_MANY_CONNECTIONS'
}
