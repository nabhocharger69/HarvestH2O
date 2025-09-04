import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ClassroomCard = ({ classroom, onViewRoster, onViewAnalytics, onManageSettings }) => {
  const navigate = useNavigate();

  const getActivityColor = (level) => {
    switch (level) {
      case 'high':
        return 'text-success bg-success/10';
      case 'medium':
        return 'text-warning bg-warning/10';
      case 'low':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const formatLastActivity = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="card-elevated card-interactive p-6 bg-card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground mb-1 truncate">
            {classroom?.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Hash" size={14} />
              <span className="font-data">{classroom?.code}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={14} />
              <span>{classroom?.studentCount} students</span>
            </div>
          </div>
        </div>
        
        {/* Activity Indicator */}
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(classroom?.activityLevel)}`}>
          {classroom?.activityLevel} activity
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{classroom?.avgEngagement}%</div>
          <div className="text-xs text-muted-foreground">Engagement</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{classroom?.completionRate}%</div>
          <div className="text-xs text-muted-foreground">Completion</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{classroom?.avgScore}</div>
          <div className="text-xs text-muted-foreground">Avg Score</div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="mb-4">
        <div className="text-xs text-muted-foreground mb-2">Recent Activity</div>
        <div className="space-y-1">
          {classroom?.recentActivities?.slice(0, 2)?.map((activity, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span className="text-foreground truncate">{activity?.description}</span>
              <span className="text-muted-foreground font-caption ml-2">
                {formatLastActivity(activity?.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          iconName="Users"
          iconPosition="left"
          onClick={() => onViewRoster(classroom)}
          className="flex-1 sm:flex-none"
        >
          Roster
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="BarChart3"
          iconPosition="left"
          onClick={() => onViewAnalytics(classroom)}
          className="flex-1 sm:flex-none"
        >
          Analytics
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconName="Settings"
          onClick={() => onManageSettings(classroom)}
        >
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </div>
  );
};

export default ClassroomCard;