import React from 'react';
import { Connection } from '../types/Connection';
import { ConnectionCard } from './ConnectionCard';

interface ConnectionGridProps {
  connections: Connection[];
  onToggleListen: (id: string) => void;
  onToggleTalk: (id: string) => void;
  onVolumeChange: (id: string, volume: number) => void;
}

export const ConnectionGrid: React.FC<ConnectionGridProps> = ({
  connections,
  onToggleListen,
  onToggleTalk,
  onVolumeChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {connections.map((connection) => (
        <ConnectionCard
          key={connection.id}
          connection={connection}
          onToggleListen={onToggleListen}
          onToggleTalk={onToggleTalk}
          onVolumeChange={onVolumeChange}
        />
      ))}
    </div>
  );
};