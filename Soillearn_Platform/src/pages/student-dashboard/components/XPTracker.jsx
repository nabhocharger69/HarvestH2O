import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import ProgressIndicator from '../../../components/ui/ProgressIndicator';

const XPTracker = ({ 
  currentXP = 245, 
  nextLevelXP = 300, 
  currentLevel = 3,
  dailyStreak = 7,
  weeklyGoal = 150,
  weeklyProgress = 120
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [recentXPGain, setRecentXPGain] = useState(null);

  const weeklyPercentage = Math.min((weeklyProgress / weeklyGoal) * 100, 100);
  const remainingXP = nextLevelXP - currentXP;

  const achievements = [
    {
      id: 1,
      name: "Quiz Master",
      description: "Complete 5 daily quizzes",
      icon: "Brain",
      unlocked: true,
      progress: 5,
      total: 5
    },
    {
      id: 2,
      name: "Green Thumb",
      description: "Upload 10 plant photos",
      icon: "Camera",
      unlocked: true,
      progress: 10,
      total: 10
    },
    {
      id: 3,
      name: "Data Collector",
      description: "Monitor sensors for 30 days",
      icon: "BarChart3",
      unlocked: false,
      progress: 18,
      total: 30
    }
  ];

  const triggerXPGain = (amount) => {
    setRecentXPGain(amount);
    setTimeout(() => setRecentXPGain(null), 2000);
  };

  useEffect(() => {
    // Simulate XP gain for demo
    const timer = setTimeout(() => {
      if (Math.random() > 0.7) {
        triggerXPGain(5);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="card-elevated p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Learning Progress</h2>
          <p className="text-sm text-muted-foreground font-caption">
            Keep growing your knowledge!
          </p>
        </div>
        
        {/* Streak Counter */}
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="flex items-center space-x-1 mb-1">
              <Icon name="Flame" size={16} className="text-accent" />
              <span className="text-lg font-bold font-data text-foreground">
                {dailyStreak}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-caption">
              Day Streak
            </p>
          </div>
        </div>
      </div>
      {/* XP Progress */}
      <div className="mb-6">
        <ProgressIndicator
          currentXP={currentXP}
          nextLevelXP={nextLevelXP}
          currentLevel={currentLevel}
          showDetails={true}
          size="lg"
        />
      </div>
      {/* Weekly Goal Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Weekly Goal
          </span>
          <span className="text-sm font-data text-muted-foreground">
            {weeklyProgress}/{weeklyGoal} XP
          </span>
        </div>
        <div className="progress-bar h-2">
          <div 
            className="progress-fill bg-secondary"
            style={{ width: `${weeklyPercentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground font-caption mt-1">
          {weeklyGoal - weeklyProgress} XP to reach weekly goal
        </p>
      </div>
      {/* Recent Achievements */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Recent Achievements
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {achievements?.map((achievement) => (
            <div
              key={achievement?.id}
              className={`p-3 rounded-lg border transition-all ${
                achievement?.unlocked
                  ? 'bg-accent/10 border-accent/20' :'bg-muted/50 border-border'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon 
                  name={achievement?.icon} 
                  size={16} 
                  className={achievement?.unlocked ? 'text-accent' : 'text-muted-foreground'}
                />
                <span className={`text-xs font-medium ${
                  achievement?.unlocked ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {achievement?.name}
                </span>
              </div>
              <div className="progress-bar h-1 mb-1">
                <div 
                  className={`h-full transition-all ${
                    achievement?.unlocked ? 'bg-accent' : 'bg-muted-foreground'
                  }`}
                  style={{ 
                    width: `${(achievement?.progress / achievement?.total) * 100}%` 
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground font-caption">
                {achievement?.progress}/{achievement?.total}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* XP Gain Animation */}
      {recentXPGain && (
        <div className="absolute top-4 right-4 animate-slide-up animate-fade-in">
          <div className="bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-bold font-data shadow-card">
            +{recentXPGain} XP
          </div>
        </div>
      )}
    </div>
  );
};

export default XPTracker;