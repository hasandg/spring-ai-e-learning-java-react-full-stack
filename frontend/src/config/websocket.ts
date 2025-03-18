import { Client, StompConfig, Frame, Message } from '@stomp/stompjs';

export const WS_RECONNECT_DELAY = 5000;
export const WS_HEARTBEAT_INTERVAL = 30000;

interface WebSocketHeaders {
  [key: string]: string;
}

const createHeaders = (token: string): WebSocketHeaders => ({
  Authorization: `Bearer ${token}`,
});

const btoa = (str: string): string => {
  return Buffer.from(str).toString('base64');
};

export const createStompConfig = (token: string): StompConfig => ({
  brokerURL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws',
  connectHeaders: createHeaders(token),
  debug: (str: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('STOMP: ' + str);
    }
  },
  reconnectDelay: WS_RECONNECT_DELAY,
  heartbeatIncoming: WS_HEARTBEAT_INTERVAL,
  heartbeatOutgoing: WS_HEARTBEAT_INTERVAL,
});

export const createWebSocketClient = (token: string): Client => {
  const client = new Client(createStompConfig(token));

  client.onConnect = (frame: Frame) => {
    console.log('Connected to WebSocket');
  };

  client.onDisconnect = () => {
    console.log('Disconnected from WebSocket');
  };

  client.onStompError = (frame: Frame) => {
    console.error('STOMP error:', frame.body);
  };

  return client;
};

export const subscribeToTopic = (
  client: Client,
  topic: string,
  callback: (message: Message) => void
): void => {
  if (client.connected) {
    client.subscribe(topic, callback);
  } else {
    console.error('WebSocket client is not connected');
  }
}; 