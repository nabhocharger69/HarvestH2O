import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsPanel = ({ metrics }) => {
  const metricItems = [
    {
      key: 'totalStudents',
      label: 'Total Students',
      icon: 'Users',
      value: metrics?.totalStudents,
      change: metrics?.studentChange,
      color: 'text-primary'
    },
    {
      key: 'avgEngagement',
      label: 'Avg Engagement',
      icon: 'TrendingUp',
      value: `${metrics?.avgEngagement}%`,
      change: metrics?.engagementChange,
      color: 'text-secondary'
    },
    {
      key: 'completionRate',
      label: 'Completion Rate',
      icon: 'CheckCircle',
      value: `${metrics?.completionRate}%`,
      change: metrics?.completionChange,
      color: 'text-success'
    },
    {
      key: 'activeClassrooms',
      label: 'Active Classrooms',
      icon: 'School',
      value: metrics?.activeClassrooms,
      change: metrics?.classroomChange,
      color: 'text-accent'
    }
  ];

  const getChangeColor = (change) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return 'TrendingUp';
    if (change < 0) return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metricItems?.map((metric) => (
        <div key={metric?.key} className="card-elevated p-4 bg-card">
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg bg-muted ${metric?.color}`}>
              <Icon name={metric?.icon} size={20} />
            </div>
            {metric?.change !== undefined && (
              <div className={`flex items-center space-x-1 ${getChangeColor(metric?.change)}`}>
                <Icon name={getChangeIcon(metric?.change)} size={12} />
                <span className="text-xs font-medium">
                  {Math.abs(metric?.change)}%
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <div className="text-2xl font-bold text-foreground">
              {metric?.value}
            </div>
            <div className="text-sm text-muted-foreground">
              {metric?.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsPanel;