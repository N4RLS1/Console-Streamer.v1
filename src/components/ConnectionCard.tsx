import React from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Activity,
  Phone,
  PhoneOff
} from 'lucide-react';
import { Connection } from '../types/Connection';
import { AudioMeter } from './AudioMeter';

interface ConnectionCardProps {
  connection: Connection;
  onToggleListen: (id: string) => void;
  onToggleTalk: (id: string) => void;
  onVolumeChange: (id: string, volume: number) => void;
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({
  connection,
  onToggleListen,
  onToggleTalk,
  onVolumeChange,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'disconnected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <Phone className="w-4 h-4" />;
      case 'connecting': return <Activity className="w-4 h-4 animate-pulse" />;
      case 'disconnected': return <PhoneOff className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`${getStatusColor(connection.status)}`}>
            {getStatusIcon(connection.status)}
          </div>
          <h3 className="text-white font-medium truncate">{connection.name}</h3>
        </div>
        <div className="text-xs text-gray-400">
          {connection.audioDevice}
        </div>
      </div>

      {/* Audio Level Meter */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span>Audio Level</span>
          <span>{Math.round(connection.audioLevel)}%</span>
        </div>
        <AudioMeter level={connection.audioLevel} />
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {/* Listen/Talk Controls */}
        <div className="flex space-x-2">
          <button
            onClick={() => onToggleListen(connection.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
              connection.listening
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            disabled={connection.status !== 'connected'}
          >
            {connection.listening ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-sm">Listen</span>
          </button>
          
          <button
            onClick={() => onToggleTalk(connection.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
              connection.talking
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            disabled={connection.status !== 'connected'}
          >
            {connection.talking ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            <span className="text-sm">Talk</span>
          </button>
        </div>

        {/* Volume Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Volume</span>
            <span>{Math.round(connection.volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={connection.volume}
            onChange={(e) => onVolumeChange(connection.id, parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            disabled={connection.status !== 'connected'}
          />
        </div>

        {/* E&M Signaling Status */}
        <div className="text-xs text-gray-500 border-t border-gray-700 pt-2">
          <div className="flex justify-between">
            <span>E-Lead: {connection.signaling?.eState ? 'HIGH' : 'LOW'}</span>
            <span>M-Lead: {connection.signaling?.mState ? 'HIGH' : 'LOW'}</span>
          </div>
          <div className="mt-1">
            State: {connection.signaling?.state?.toUpperCase() || 'UNKNOWN'}
          </div>
        </div>
      </div>
    </div>
  );
};