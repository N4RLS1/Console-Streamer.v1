export interface Connection {
  id: string;
  name: string;
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  audioDevice: string;
  listening: boolean;
  talking: boolean;
  volume: number;
  audioLevel: number;
  signaling?: {
    state: string;
    eState: boolean;
    mState: boolean;
  };
  lastActivity: number;
}