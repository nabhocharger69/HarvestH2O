import React from 'react';
import Icon from '../../../components/AppIcon';

const DataFeed = ({ sensorData, isConnected, lastUpdate }) => {
  const getSensorIcon = (type) => {
    switch (type) {
      case 'moisture':
        return 'Droplets';
      case 'temperature':
        return 'Thermometer';
      case 'humidity':
        return 'Cloud';
      case 'light':
        return 'Sun';
      case 'pressure':
        return 'Gauge';
      case 'nitrogen':
        return 'Leaf';
      case 'phosphorus':
        return 'Zap';
      case 'potassium':
        return 'Shield';
      default:
        return 'Activity';
    }
  };

  const getSensorUnit = (type) => {
    switch (type) {
      case 'moisture':
        return '%';
      case 'temperature':
        return '°C';
      case 'humidity':
        return '%';
      case 'light':
        return 'lux';
      case 'pressure':
        return 'hPa';
      case 'nitrogen':
        return '%';
      case 'phosphorus':
        return '%';
      case 'potassium':
        return '%';
      default:
        return '';
    }
  };

  const getValueColor = (type, value) => {
    switch (type) {
      case 'moisture':
        if (value > 70) return 'text-success';
        if (value > 30) return 'text-warning';
        return 'text-error';
      case 'temperature':
        if (value >= 18 && value <= 25) return 'text-success';
        if (value >= 15 && value <= 30) return 'text-warning';
        return 'text-error';
      case 'humidity':
        if (value >= 40 && value <= 70) return 'text-success';
        if (value >= 30 && value <= 80) return 'text-warning';
        return 'text-error';
      case 'light':
        if (value >= 1000 && value <= 2000) return 'text-success';
        if (value >= 500 && value <= 3000) return 'text-warning';
        return 'text-error';
      case 'pressure':
        if (value >= 1010 && value <= 1020) return 'text-success';
        if (value >= 1000 && value <= 1030) return 'text-warning';
        return 'text-error';
      case 'nitrogen':
        if (value >= 70 && value <= 85) return 'text-success';
        if (value >= 60 && value <= 90) return 'text-warning';
        return 'text-error';
      case 'phosphorus':
        if (value >= 35 && value <= 50) return 'text-success';
        if (value >= 25 && value <= 60) return 'text-warning';
        return 'text-error';
      case 'potassium':
        if (value >= 60 && value <= 75) return 'text-success';
        if (value >= 50 && value <= 80) return 'text-warning';
        return 'text-error';
      default:
        return 'text-foreground';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getDataQuality = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 5000) return { status: 'excellent', color: 'text-success', label: 'Real-time' };
    if (diff < 30000) return { status: 'good', color: 'text-secondary', label: 'Recent' };
    if (diff < 60000) return { status: 'fair', color: 'text-warning', label: 'Delayed' };
    return { status: 'poor', color: 'text-error', label: 'Stale' };
  };

  const dataQuality = getDataQuality(lastUpdate);

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <Icon name="Activity" size={24} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Real-time Data Feed</h3>
            <p className="text-sm text-muted-foreground font-caption">Live sensor readings</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 ${dataQuality?.color}`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-success animate-pulse' : 'bg-error'
            }`} />
            <span className="text-xs font-medium font-caption">{dataQuality?.label}</span>
          </div>
        </div>
      </div>
      {!isConnected ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Icon name="WifiOff" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Device not connected</p>
          <p className="text-sm text-muted-foreground font-caption mt-1">
            Connect your ESP32 device to view real-time data
          </p>
        </div>
      ) : (
        <>
          {/* Sensor Data Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {sensorData?.map((sensor) => (
              <div key={sensor?.type} className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getSensorIcon(sensor?.type)} 
                      size={16} 
                      className="text-muted-foreground"
                    />
                    <span className="text-sm font-medium text-foreground capitalize">
                      {sensor?.type}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-caption">
                    {formatTimestamp(sensor?.timestamp)}
                  </span>
                </div>
                
                <div className="flex items-baseline space-x-1">
                  <span className={`text-2xl font-bold font-data ${getValueColor(sensor?.type, sensor?.value)}`}>
                    {typeof sensor?.value === 'number' ? sensor?.value.toFixed(2) : sensor?.value}
                  </span>
                  <span className="text-sm text-muted-foreground font-data">
                    {getSensorUnit(sensor?.type)}
                  </span>
                </div>

                {/* Mini trend indicator */}
                <div className="flex items-center space-x-1 mt-2">
                  <Icon 
                    name={sensor?.trend === 'up' ? 'TrendingUp' : sensor?.trend === 'down' ? 'TrendingDown' : 'Minus'} 
                    size={12} 
                    className={
                      sensor?.trend === 'up' ? 'text-success' : 
                      sensor?.trend === 'down'? 'text-error' : 'text-muted-foreground'
                    }
                  />
                  <span className="text-xs text-muted-foreground font-caption">
                    {sensor?.change > 0 ? '+' : ''}{sensor?.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Last Update Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={14} />
              <span className="font-caption">
                Last updated: {formatTimestamp(lastUpdate)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Icon name="Database" size={14} />
              <span className="font-caption">
                {sensorData?.length} sensors active
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DataFeed;