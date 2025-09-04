import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const QuizTimer = ({
  initialTime = 300, // 5 minutes default
  onTimeUp,
  isActive = true,
  onTimeUpdate
}) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        
        // Warning state when 30 seconds or less
        setIsWarning(newTime <= 30);
        
        // Notify parent of time update
        if (onTimeUpdate) {
          onTimeUpdate(newTime);
        }
        
        // Time's up
        if (newTime <= 0) {
          if (onTimeUp) {
            onTimeUp();
          }
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeUp, onTimeUpdate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return (timeRemaining / initialTime) * 100;
  };

  const getTimerColor = () => {
    if (timeRemaining <= 10) return 'text-error';
    if (isWarning) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getProgressColor = () => {
    if (timeRemaining <= 10) return 'bg-error';
    if (isWarning) return 'bg-warning';
    return 'bg-secondary';
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Timer Icon */}
      <div className={`${getTimerColor()} ${isWarning ? 'animate-pulse' : ''}`}>
        <Icon name="Clock" size={20} />
      </div>

      {/* Time Display */}
      <div className="flex flex-col">
        <div className={`text-lg font-bold font-data ${getTimerColor()}`}>
          {formatTime(timeRemaining)}
        </div>
        
        {/* Progress Bar */}
        <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${getProgressColor()}`}
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Warning Message */}
      {isWarning && (
        <div className="text-xs text-warning font-medium animate-pulse">
          {timeRemaining <= 10 ? 'Time almost up!' : 'Hurry up!'}
        </div>
      )}
    </div>
  );
};

export default QuizTimer;