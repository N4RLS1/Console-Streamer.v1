import React from 'react';
import { 
  Cpu, 
  HardDrive, 
  Wifi, 
  Activity,
  Users,
  Headphones
} from 'lucide-react';
import { AudioDevice } from '../types/AudioDevice';

interface SystemStatusProps {
  audioDevices: AudioDevice[];
  connectionCount: number;
  activeConnections: number;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({
  audioDevices,
  connectionCount,
  activeConnections,
}) => {
  const activeDevices = audioDevices.filter(device => device.status === 'active');

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
        <Activity className="w-5 h-5 mr-2" />
        System Status
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Connections Status */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-300 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Connections
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total:</span>
              <span className="text-white">{connectionCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Active:</span>
              <span className="text-green-400">{activeConnections}</span>
            </div>
          </div>
        </div>

        {/* Audio Devices */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-300 flex items-center">
            <Headphones className="w-4 h-4 mr-2" />
            Audio Devices
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total:</span>
              <span className="text-white">{audioDevices.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Active:</span>
              <span className="text-green-400">{activeDevices.length}</span>
            </div>
          </div>
        </div>

        {/* System Resources */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-300 flex items-center">
            <Cpu className="w-4 h-4 mr-2" />
            Resources
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">CPU:</span>
              <span className="text-white">45%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Memory:</span>
              <span className="text-white">2.1GB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Devices List */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-300 mb-3">USB Audio Devices</h3>
        <div className="space-y-2">
          {audioDevices.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between p-3 bg-gray-700 rounded-md"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  device.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                }`} />
                <span className="text-sm text-white">{device.name}</span>
              </div>
              <div className="text-xs text-gray-400">
                {device.channels} channels
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};