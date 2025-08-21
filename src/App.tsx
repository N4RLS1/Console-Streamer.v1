import React, { useState } from 'react';
import { Phone, Plus, Radio } from 'lucide-react';
import { useSocket } from './hooks/useSocket';
import { ConnectionGrid } from './components/ConnectionGrid';
import { SystemStatus } from './components/SystemStatus';
import { ControlPanel } from './components/ControlPanel';

function App() {
  const {
    connections,
    audioDevices,
    createConnection,
    toggleListen,
    toggleTalk,
    setVolume,
  } = useSocket();

  const [masterVolume, setMasterVolume] = useState(0.8);
  const [masterMute, setMasterMute] = useState(false);
  const [micMute, setMicMute] = useState(false);
  const [showNewConnection, setShowNewConnection] = useState(false);
  const [newConnectionName, setNewConnectionName] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');

  const activeConnections = connections.filter(c => c.status === 'connected').length;

  const handleCreateConnection = () => {
    if (newConnectionName && selectedDevice) {
      createConnection({
        name: newConnectionName,
        audioDevice: selectedDevice,
      });
      setNewConnectionName('');
      setSelectedDevice('');
      setShowNewConnection(false);
    }
  };

  const handleVolumeChange = (connectionId: string, volume: number) => {
    setVolume(connectionId, volume);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Radio className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-xl font-semibold text-white">
                  E&M Voice Streaming System
                </h1>
                <p className="text-sm text-gray-400">
                  Multi-channel audio with E&M signaling
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                {activeConnections} / {connections.length} Active
              </div>
              <button
                onClick={() => setShowNewConnection(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Connection</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Connection Grid */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <Phone className="w-6 h-6 mr-2" />
                Active Connections
              </h2>
              {connections.length > 0 ? (
                <ConnectionGrid
                  connections={connections}
                  onToggleListen={toggleListen}
                  onToggleTalk={toggleTalk}
                  onVolumeChange={handleVolumeChange}
                />
              ) : (
                <div className="text-center py-16">
                  <Phone className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-400 mb-2">
                    No Active Connections
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Create a new connection to start voice streaming
                  </p>
                  <button
                    onClick={() => setShowNewConnection(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Create First Connection
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Control Panel */}
            <ControlPanel
              masterVolume={masterVolume}
              masterMute={masterMute}
              micMute={micMute}
              onMasterVolumeChange={setMasterVolume}
              onMasterMuteToggle={() => setMasterMute(!masterMute)}
              onMicMuteToggle={() => setMicMute(!micMute)}
              onShowSettings={() => {}}
            />

            {/* System Status */}
            <SystemStatus
              audioDevices={audioDevices}
              connectionCount={connections.length}
              activeConnections={activeConnections}
            />
          </div>
        </div>
      </div>

      {/* New Connection Modal */}
      {showNewConnection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">
              Create New Connection
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Connection Name
                </label>
                <input
                  type="text"
                  value={newConnectionName}
                  onChange={(e) => setNewConnectionName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter connection name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Audio Device
                </label>
                <select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select device</option>
                  {audioDevices
                    .filter(device => device.status === 'active')
                    .map(device => (
                      <option key={device.id} value={device.id}>
                        {device.name}
                      </option>
                    ))
                  }
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowNewConnection(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateConnection}
                disabled={!newConnectionName || !selectedDevice}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;