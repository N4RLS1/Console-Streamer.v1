import React from 'react';

interface AudioMeterProps {
  level: number; // 0-100
}

export const AudioMeter: React.FC<AudioMeterProps> = ({ level }) => {
  const getBarColor = (index: number, level: number) => {
    const threshold = (index + 1) * 10;
    if (level < threshold) return 'bg-gray-600';
    
    if (threshold <= 30) return 'bg-green-500';
    if (threshold <= 60) return 'bg-yellow-500';
    if (threshold <= 80) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex space-x-1 h-3">
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className={`flex-1 rounded-sm transition-all duration-150 ${getBarColor(i, level)}`}
          style={{
            height: level > (i + 1) * 10 ? '100%' : '20%',
          }}
        />
      ))}
    </div>
  );
};