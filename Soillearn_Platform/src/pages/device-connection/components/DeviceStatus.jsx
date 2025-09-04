import React from 'react';
import Icon from '../../../components/AppIcon';

const DeviceStatus = ({ device, onConnect, onDisconnect, onRefresh }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-success';
      case 'connecting':
        return 'text-warning';
      case 'disconnected':
        return 'text-error';
      case 'discovering':
        return 'text-secondary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return 'CheckCircle';
      case 'connecting':
        return 'Loader';
      case 'disconnected':
        return 'XCircle';
      case 'discovering':
        return 'Search';
      default:
        return 'Circle';
    }
  };

  const getSignalStrength = (strength) => {
    if (strength >= 80) return { icon: 'Wifi', color: 'text-success', bars: 4 };
    if (strength >= 60) return { icon: 'Wifi', color: 'text-secondary', bars: 3 };
    if (strength >= 40) return { icon: 'Wifi', color: 'text-warning', bars: 2 };
    if (strength >= 20) return { icon: 'Wifi', color: 'text-error', bars: 1 };
    return { icon: 'WifiOff', color: 'text-error', bars: 0 };
  };

  const signal = getSignalStrength(device?.signalStrength);

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="Smartphone" size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">ESP32 Device</h3>
            <p className="text-sm text-muted-foreground font-caption">Plant Monitor #{device?.id}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 ${getStatusColor(device?.status)}`}>
            <Icon 
              name={getStatusIcon(device?.status)} 
              size={16} 
              className={device?.status === 'connecting' ? 'animate-spin' : ''}
            />
            <span className="text-sm font-medium capitalize">{device?.status}</span>
          </div>
        </div>
      </div>
      {/* Device Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground font-caption uppercase tracking-wide">
              MAC Address
            </label>
            <p className="text-sm font-data text-foreground mt-1">{device?.macAddress}</p>
          </div>
          
          <div>
            <label className="text-xs font-medium text-muted-foreground font-caption uppercase tracking-wide">
              Firmware Version
            </label>
            <p className="text-sm font-data text-foreground mt-1">v{device?.firmwareVersion}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground font-caption uppercase tracking-wide">
              Signal Strength
            </label>
            <div className="flex items-center space-x-2 mt-1">
              <Icon name={signal?.icon} size={16} className={signal?.color} />
              <span className="text-sm font-data text-foreground">{device?.signalStrength}%</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4]?.map((bar) => (
                  <div
                    key={bar}
                    className={`w-1 h-3 rounded-full ${
                      bar <= signal?.bars ? 'bg-current' : 'bg-muted'
                    } ${signal?.color}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground font-caption uppercase tracking-wide">
              Battery Level
            </label>
            <div className="flex items-center space-x-2 mt-1">
              <Icon 
                name={device?.batteryLevel > 20 ? 'Battery' : 'BatteryLow'} 
                size={16} 
                className={device?.batteryLevel > 20 ? 'text-success' : 'text-warning'}
              />
              <span className="text-sm font-data text-foreground">{device?.batteryLevel}%</span>
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    device?.batteryLevel > 20 ? 'bg-success' : 'bg-warning'
                  }`}
                  style={{ width: `${device?.batteryLevel}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Connection Actions */}
      <div className="flex flex-wrap gap-3">
        {device?.status === 'disconnected' && (
          <button
            onClick={onConnect}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors focus-ring"
          >
            <Icon name="Wifi" size={16} />
            <span className="font-medium">Connect Device</span>
          </button>
        )}

        {device?.status === 'connected' && (
          <button
            onClick={onDisconnect}
            className="flex items-center space-x-2 px-4 py-2 bg-error text-error-foreground rounded-md hover:bg-error/90 transition-colors focus-ring"
          >
            <Icon name="WifiOff" size={16} />
            <span className="font-medium">Disconnect</span>
          </button>
        )}

        <button
          onClick={onRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors focus-ring"
        >
          <Icon name="RefreshCw" size={16} />
          <span className="font-medium">Refresh</span>
        </button>
      </div>
    </div>
  );
};

export default DeviceStatus;