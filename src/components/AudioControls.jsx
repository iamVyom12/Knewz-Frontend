import React from 'react';
import { PlayCircle, PauseCircle, Rewind, FastForward } from 'lucide-react';

const AudioControls = ({ isPlaying, onPlayPause, readingSpeed, onSpeedChange, speeds }) => {
  return (
    <div className="pt-6 border-t">
      {/* Main Audio Controls */}
      <div className="flex flex-col items-center space-y-4">
        {/* Player Controls */}
        <div className="flex items-center justify-center space-x-6 w-full">
          <button
            onClick={() => onSpeedChange(readingSpeed / 2)}
            className="text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Decrease speed"
          >
            <Rewind size={24} />
          </button>
          
          <button
            onClick={onPlayPause}
            className="text-blue-600 hover:text-blue-800 transition-colors transform hover:scale-110"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <PauseCircle size={48} className="fill-current" />
            ) : (
              <PlayCircle size={48} className="fill-current" />
            )}
          </button>
          
          <button
            onClick={() => onSpeedChange(readingSpeed * 2)}
            className="text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Increase speed"
          >
            <FastForward size={24} />
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center justify-center space-x-2 bg-gray-50 rounded-full px-4 py-2">
          {speeds.map((speed) => (
            <button
              key={speed}
              onClick={() => onSpeedChange(speed)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                readingSpeed === speed
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioControls;