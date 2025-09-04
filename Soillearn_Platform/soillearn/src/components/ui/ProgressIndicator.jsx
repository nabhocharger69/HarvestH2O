import React, { useEffect } from 'react';
import Icon from '../AppIcon';

const ProgressIndicator = ({ 
  currentXP = 0, 
  nextLevelXP = 100, 
  currentLevel = 1,
  showDetails = true,
  size = 'default',
  className = ''
}) => {
  const progressPercentage = Math.min((currentXP / nextLevelXP) * 100, 100);
  const remainingXP = Math.max(nextLevelXP - currentXP, 0);

  const sizeClasses = {
    sm: {
      container: 'h-6',
      text: 'text-xs',
      icon: 12,
      bar: 'h-1.5'
    },
    default: {
      container: 'h-8',
      text: 'text-sm',
      icon: 16,
      bar: 'h-2'
    },
    lg: {
      container: 'h-10',
      text: 'text-base',
      icon: 20,
      bar: 'h-3'
    }
  };

  const currentSize = sizeClasses?.[size];

  const getLevelBadgeColor = (level) => {
    if (level >= 10) return 'bg-accent text-accent-foreground'; // Gold
    if (level >= 5) return 'bg-secondary text-secondary-foreground'; // Silver
    return 'bg-muted text-muted-foreground'; // Bronze
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Level Badge */}
      <div className={`achievement-badge ${getLevelBadgeColor(currentLevel)} flex items-center space-x-1`}>
        <Icon name="Trophy" size={currentSize?.icon} />
        <span className={`font-bold font-data ${currentSize?.text}`}>
          L{currentLevel}
        </span>
      </div>
      {/* Progress Section */}
      <div className="flex-1 min-w-0">
        {/* Progress Bar */}
        <div className={`progress-bar ${currentSize?.bar} relative overflow-hidden`}>
          <div 
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
          
          {/* Animated Shine Effect */}
          {progressPercentage > 0 && (
            <div 
              className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
              style={{ 
                transform: `translateX(${progressPercentage - 100}%)`,
                transition: 'transform 0.3s ease-out'
              }}
            />
          )}
        </div>

        {/* Progress Details */}
        {showDetails && (
          <div className="flex items-center justify-between mt-1">
            <div className={`${currentSize?.text} text-muted-foreground font-data`}>
              {currentXP?.toLocaleString()} XP
            </div>
            <div className={`${currentSize?.text} text-muted-foreground font-caption`}>
              {remainingXP > 0 ? `${remainingXP} to next level` : 'Level Complete!'}
            </div>
          </div>
        )}
      </div>
      {/* XP Gain Animation Container */}
      <div className="relative">
        {/* This would be populated by XP gain animations */}
        <div id="xp-animation-container" className="absolute -top-8 right-0 pointer-events-none" />
      </div>
    </div>
  );
};

// XP Gain Animation Component (for when XP is earned)
export const XPGainAnimation = ({ amount, onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="animate-slide-up animate-fade-in">
      <div className="bg-success text-success-foreground px-2 py-1 rounded-md text-xs font-bold font-data shadow-card">
        +{amount} XP
      </div>
    </div>
  );
};

// Level Up Animation Component
export const LevelUpAnimation = ({ newLevel, onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="animate-bounce-subtle">
      <div className="bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 shadow-modal">
        <Icon name="Star" size={20} />
        <span>Level {newLevel} Unlocked!</span>
        <Icon name="Star" size={20} />
      </div>
    </div>
  );
};

export default ProgressIndicator;