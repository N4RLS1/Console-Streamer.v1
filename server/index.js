import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { execSync } from 'child_process';
import fs from 'fs';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store active connections and their states
const connections = new Map();
const audioDevices = new Map();

// E&M Signaling states
const EM_STATES = {
  IDLE: 'idle',
  SEIZED: 'seized',
  ANSWERED: 'answered',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected'
};

// Audio device discovery
function discoverAudioDevices() {
  try {
    // Simulate USB sound card discovery
    const devices = [
      { id: 'usb0', name: 'USB Audio Device 1', channels: 2, status: 'active' },
      { id: 'usb1', name: 'USB Audio Device 2', channels: 2, status: 'active' },
      { id: 'usb2', name: 'USB Audio Device 3', channels: 2, status: 'inactive' },
      { id: 'usb3', name: 'USB Audio Device 4', channels: 2, status: 'active' }
    ];
    
    devices.forEach(device => {
      audioDevices.set(device.id, device);
    });
    
    return devices;
  } catch (error) {
    console.error('Error discovering audio devices:', error);
    return [];
  }
}

// E&M Signaling handler
class EMSignaling {
  constructor(connectionId) {
    this.connectionId = connectionId;
    this.state = EM_STATES.IDLE;
    this.eState = false; // E-lead state
    this.mState = false; // M-lead state
  }
  
  seize() {
    this.state = EM_STATES.SEIZED;
    this.mState = true;
    console.log(`Connection ${this.connectionId}: E&M Seized`);
  }
  
  answer() {
    this.state = EM_STATES.ANSWERED;
    this.eState = true;
    console.log(`Connection ${this.connectionId}: E&M Answered`);
  }
  
  connect() {
    this.state = EM_STATES.CONNECTED;
    console.log(`Connection ${this.connectionId}: E&M Connected`);
  }
  
  disconnect() {
    this.state = EM_STATES.DISCONNECTED;
    this.eState = false;
    this.mState = false;
    console.log(`Connection ${this.connectionId}: E&M Disconnected`);
  }
}

// Connection management
function createConnection(socketId, config) {
  const connection = {
    id: socketId,
    name: config.name || `Connection ${socketId.substr(0, 8)}`,
    status: 'connecting',
    audioDevice: config.audioDevice,
    listening: false,
    talking: false,
    volume: 0.8,
    audioLevel: 0,
    signaling: new EMSignaling(socketId),
    lastActivity: Date.now()
  };
  
  connections.set(socketId, connection);
  return connection;
}

// Audio level simulation
function simulateAudioLevels() {
  connections.forEach((conn, id) => {
    if (conn.status === 'connected' && (conn.listening || conn.talking)) {
      // Simulate varying audio levels
      conn.audioLevel = Math.random() * 100;
    } else {
      conn.audioLevel = 0;
    }
  });
}

// Initialize audio devices
discoverAudioDevices();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send initial data
  socket.emit('audioDevices', Array.from(audioDevices.values()));
  socket.emit('connections', Array.from(connections.values()));
  
  socket.on('createConnection', (config) => {
    const connection = createConnection(socket.id, config);
    connection.signaling.seize();
    connection.signaling.answer();
    connection.signaling.connect();
    connection.status = 'connected';
    
    io.emit('connectionUpdate', connection);
  });
  
  socket.on('updateConnection', (data) => {
    const connection = connections.get(data.id);
    if (connection) {
      Object.assign(connection, data);
      io.emit('connectionUpdate', connection);
    }
  });
  
  socket.on('toggleListen', (connectionId) => {
    const connection = connections.get(connectionId);
    if (connection) {
      connection.listening = !connection.listening;
      io.emit('connectionUpdate', connection);
    }
  });
  
  socket.on('toggleTalk', (connectionId) => {
    const connection = connections.get(connectionId);
    if (connection) {
      connection.talking = !connection.talking;
      io.emit('connectionUpdate', connection);
    }
  });
  
  socket.on('setVolume', ({ connectionId, volume }) => {
    const connection = connections.get(connectionId);
    if (connection) {
      connection.volume = volume;
      io.emit('connectionUpdate', connection);
    }
  });
  
  socket.on('disconnect', () => {
    const connection = connections.get(socket.id);
    if (connection) {
      connection.signaling.disconnect();
      connections.delete(socket.id);
      io.emit('connectionRemoved', socket.id);
    }
    console.log('Client disconnected:', socket.id);
  });
});

// Simulate audio levels periodically
setInterval(simulateAudioLevels, 100);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Voice Streaming Server running on port ${PORT}`);
});