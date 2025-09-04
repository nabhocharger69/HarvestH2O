import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const StudentHeader = ({ student }) => {
  const getLevelBadgeColor = (level) => {
    if (level >= 10) return 'bg-accent text-accent-foreground';
    if (level >= 5) return 'bg-secondary text-secondary-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const getStreakColor = (streak) => {
    if (streak >= 7) return 'text-success';
    if (streak >= 3) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card p-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Student Avatar and Basic Info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src={student?.avatar}
              alt={`${student?.name}'s profile`}
              className="w-20 h-20 rounded-full object-cover border-2 border-border"
            />
            <div className="absolute -bottom-1 -right-1 bg-card border border-border rounded-full p-1">
              <Icon name="User" size={16} className="text-muted-foreground" />
            </div>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-foreground">{student?.name}</h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-sm text-muted-foreground font-data">
                Roll: {student?.rollNumber}
              </span>
              <span className="text-sm text-muted-foreground">
                Class: {student?.class}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Icon name="Leaf" size={16} className="text-secondary" />
              <span className="text-sm text-foreground font-medium">
                {student?.plantType}
              </span>
            </div>
          </div>
        </div>

        {/* XP and Level Info */}
        <div className="flex-1 lg:ml-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Current Level */}
            <div className="text-center">
              <div className={`achievement-badge ${getLevelBadgeColor(student?.level)} mx-auto mb-2`}>
                <Icon name="Trophy" size={16} className="mr-1" />
                <span className="font-bold font-data">L{student?.level}</span>
              </div>
              <p className="text-xs text-muted-foreground font-caption">Current Level</p>
            </div>

            {/* Total XP */}
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground font-data">
                {student?.totalXP?.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground font-caption">Total XP</p>
            </div>

            {/* Current Streak */}
            <div className="text-center">
              <div className={`text-2xl font-bold font-data ${getStreakColor(student?.currentStreak)}`}>
                {student?.currentStreak}
              </div>
              <p className="text-xs text-muted-foreground font-caption">Day Streak</p>
            </div>

            {/* Last Active */}
            <div className="text-center">
              <div className="text-sm font-medium text-foreground">
                {student?.lastActive}
              </div>
              <p className="text-xs text-muted-foreground font-caption">Last Active</p>
            </div>
          </div>
        </div>
      </div>
      {/* Achievement Badges */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">Recent Achievements</h3>
        <div className="flex flex-wrap gap-2">
          {student?.achievements?.map((achievement) => (
            <div
              key={achievement?.id}
              className={`achievement-badge ${achievement?.rarity === 'gold' ? 'achievement-gold' : 'achievement-silver'} flex items-center gap-1`}
              title={achievement?.description}
            >
              <Icon name={achievement?.icon} size={14} />
              <span className="text-xs font-medium">{achievement?.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentHeader;