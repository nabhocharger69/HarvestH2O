import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SensorCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  color = 'text-primary',
  bgColor = 'bg-primary/10',
  trend = null,
  status = 'normal',
  targetValue = null
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      const increment = value / 50;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setAnimatedValue(value);
          clearInterval(interval);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, 20);
      return () => clearInterval(interval);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const getStatusColor = () => {
    switch (status) {
      case 'good':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'critical':
        return 'text-error';
      default:
        return color;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'good':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'critical':
        return 'AlertCircle';
      default:
        return null;
    }
  };

  const getTrendIcon = () => {
    if (trend > 0) return 'TrendingUp';
    if (trend < 0) return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend > 0) return 'text-success';
    if (trend < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className={`card-elevated card-interactive p-6 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${bgColor}`}>
            <Icon name={icon} size={20} className={color} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            {targetValue && (
              <p className="text-xs text-muted-foreground font-caption">
                Target: {targetValue}{unit}
              </p>
            )}
          </div>
        </div>
        
        {/* Status Indicator */}
        {getStatusIcon() && (
          <Icon 
            name={getStatusIcon()} 
            size={16} 
            className={getStatusColor()}
          />
        )}
      </div>

      {/* Value Display */}
      <div className="mb-3">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold font-data text-foreground">
            {animatedValue}
          </span>
          <span className="text-sm text-muted-foreground font-caption">
            {unit}
          </span>
        </div>
      </div>

      {/* Trend and Progress */}
      <div className="flex items-center justify-between">
        {trend !== null && (
          <div className="flex items-center space-x-1">
            <Icon 
              name={getTrendIcon()} 
              size={14} 
              className={getTrendColor()}
            />
            <span className={`text-xs font-medium font-data ${getTrendColor()}`}>
              {Math.abs(trend)}%
            </span>
          </div>
        )}
        
        {/* Progress Bar for Target */}
        {targetValue && (
          <div className="flex-1 ml-4">
            <div className="progress-bar h-1.5">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${Math.min((value / targetValue) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Last Updated */}
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground font-caption">
          Updated 2 minutes ago
        </p>
      </div>
    </div>
  );
};

export default SensorCard;