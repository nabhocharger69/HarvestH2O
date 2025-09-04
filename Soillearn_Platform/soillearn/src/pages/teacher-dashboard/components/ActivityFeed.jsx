import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities, className = '' }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'quiz_completed':
        return 'CheckCircle';
      case 'photo_uploaded':
        return 'Camera';
      case 'device_connected':
        return 'Smartphone';
      case 'achievement_earned':
        return 'Award';
      case 'level_up':
        return 'Star';
      case 'task_completed':
        return 'Check';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'quiz_completed':
      case 'task_completed':
        return 'text-success';
      case 'photo_uploaded':
        return 'text-secondary';
      case 'device_connected':
        return 'text-primary';
      case 'achievement_earned': 
      case 'level_up':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className={`card-elevated bg-card ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <Icon name="Activity" size={20} className="text-muted-foreground" />
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {activities?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Activity" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {activities?.map((activity) => (
              <div key={activity?.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`mt-1 ${getActivityColor(activity?.type)}`}>
                  <Icon name={getActivityIcon(activity?.type)} size={16} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-foreground font-medium">
                      {activity?.studentName}
                    </p>
                    <span className="text-xs text-muted-foreground font-caption">
                      {formatTimeAgo(activity?.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity?.description}
                  </p>
                  
                  {activity?.classroom && (
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <Icon name="Hash" size={12} className="mr-1" />
                      <span>{activity?.classroom}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;