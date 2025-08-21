import React from 'react';
import { 
  Volume2, 
  VolumeX,
  Mic,
  MicOff,
  Settings,
  Power
} from 'lucide-react';

interface ControlPanelProps {
  masterVolume: number;
  masterMute: boolean;
  micMute: boolean;
  onMasterVolumeChange: (volume: number) => void;
  onMasterMuteToggle: () => void;
  onMicMuteToggle: () => void;
  onShowSettings: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  masterVolume,
  masterMute,
  micMute,
  onMasterVolumeChange,
  onMasterMuteToggle,
  onMicMuteToggle,
  onShowSettings,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-6">Master Controls</h2>
      
      <div className="space-y-6">
        {/* Master Volume */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">Master Volume</label>
            <span className="text-sm text-gray-400">{Math.round(masterVolume * 100)}%</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onMasterMuteToggle}
              className={`p-2 rounded-md transition-colors ${
                masterMute ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {masterMute ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVolume}
              onChange={(e) => onMasterVolumeChange(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              disabled={masterMute}
            />
          </div>
        </div>

        {/* Global Controls */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onMicMuteToggle}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition-colors ${
              micMute 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {micMute ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span className="text-sm">Global Mic</span>
          </button>
          
          <button
            onClick={onShowSettings}
            className="flex items-center justify-center space-x-2 px-4 py-3 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-2">
            <button className="text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors">
              Listen All Connections
            </button>
            <button className="text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors">
              Mute All Connections
            </button>
            <button className="text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors">
              Reset Audio Devices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};