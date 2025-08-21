import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Connection } from '../types/Connection';
import { AudioDevice } from '../types/AudioDevice';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('audioDevices', (devices: AudioDevice[]) => {
      setAudioDevices(devices);
    });

    newSocket.on('connections', (conns: Connection[]) => {
      setConnections(conns);
    });

    newSocket.on('connectionUpdate', (connection: Connection) => {
      setConnections(prev => {
        const index = prev.findIndex(c => c.id === connection.id);
        if (index >= 0) {
          const newConnections = [...prev];
          newConnections[index] = connection;
          return newConnections;
        }
        return [...prev, connection];
      });
    });

    newSocket.on('connectionRemoved', (connectionId: string) => {
      setConnections(prev => prev.filter(c => c.id !== connectionId));
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const createConnection = (config: { name: string; audioDevice: string }) => {
    socket?.emit('createConnection', config);
  };

  const toggleListen = (connectionId: string) => {
    socket?.emit('toggleListen', connectionId);
  };

  const toggleTalk = (connectionId: string) => {
    socket?.emit('toggleTalk', connectionId);
  };

  const setVolume = (connectionId: string, volume: number) => {
    socket?.emit('setVolume', { connectionId, volume });
  };

  return {
    socket,
    connections,
    audioDevices,
    createConnection,
    toggleListen,
    toggleTalk,
    setVolume,
  };
};