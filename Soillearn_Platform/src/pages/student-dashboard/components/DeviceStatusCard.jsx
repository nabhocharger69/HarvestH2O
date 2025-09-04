import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeviceStatusCard = () => {
  const [deviceStatus, setDeviceStatus] = useState({
    connected: true,
    deviceName: "ESP32-PlantMonitor-001",
    lastSync: new Date(Date.now() - 2 * 60 * 1000),
    batteryLevel: 78,
    signalStrength: -45,
    dataPoints: 1247
  });

  const [connectionHistory, setConnectionHistory] = useState([
    { timestamp: new Date(Date.now() - 5 * 60 * 1000), status: 'connected' },
    { timestamp: new Date(Date.now() - 15 * 60 * 1000), status: 'disconnected' },
    { timestamp: new Date(Date.now() - 25 * 60 * 1000), status: 'connected' }
  ]);

  const getSignalStrengthIcon = (strength) => {
    if (strength > -50) return 'Wifi';
    if (strength > -70) return 'Wifi';
    return 'WifiOff';
  };

  const getSignalStrengthColor = (strength) => {
    if (strength > -50) return 'text-success';
    if (strength > -70) return 'text-warning';
    return 'text-error';
  };

  const getBatteryIcon = (level) => {
    if (level > 75) return 'Battery';
    if (level > 50) return 'Battery';
    if (level > 25) return 'Battery';
    return 'Battery';
  };

  const getBatteryColor = (level) => {
    if (level > 50) return 'text-success';
    if (level > 25) return 'text-warning';
    return 'text-error';
  };

  const formatLastSync = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  const handleDeviceAction = () => {
    window.location.href = '/device-connection';
  };

  return (
    <div className="card-elevated p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Device</h2>
          <p className="text-sm text-muted-foreground font-caption">
            ESP32 sensor monitoring status
          </p>
        </div>
        
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            deviceStatus?.connected ? 'bg-success animate-pulse' : 'bg-error'
          }`} />
          <span className={`text-sm font-medium ${
            deviceStatus?.connected ? 'text-success' : 'text-error'
          }`}>
            {deviceStatus?.connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      {/* Device Info */}
      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-3 mb-3">
          <Icon name="Smartphone" size={20} className="text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {deviceStatus?.deviceName}
            </h3>
            <p className="text-xs text-muted-foreground font-caption">
              Last sync: {formatLastSync(deviceStatus?.lastSync)}
            </p>
          </div>
        </div>

        {/* Device Metrics */}
        <div className="grid grid-cols-3 gap-4">
          {/* Battery Level */}
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <Icon 
                name={getBatteryIcon(deviceStatus?.batteryLevel)} 
                size={18} 
                className={getBatteryColor(deviceStatus?.batteryLevel)}
              />
            </div>
            <div className="text-sm font-bold font-data text-foreground">
              {deviceStatus?.batteryLevel}%
            </div>
            <div className="text-xs text-muted-foreground font-caption">
              Battery
            </div>
          </div>

          {/* Signal Strength */}
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <Icon 
                name={getSignalStrengthIcon(deviceStatus?.signalStrength)} 
                size={18} 
                className={getSignalStrengthColor(deviceStatus?.signalStrength)}
              />
            </div>
            <div className="text-sm font-bold font-data text-foreground">
              {deviceStatus?.signalStrength} dBm
            </div>
            <div className="text-xs text-muted-foreground font-caption">
              Signal
            </div>
          </div>

          {/* Data Points */}
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <Icon name="Database" size={18} className="text-secondary" />
            </div>
            <div className="text-sm font-bold font-data text-foreground">
              {deviceStatus?.dataPoints?.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground font-caption">
              Data Points
            </div>
          </div>
        </div>
      </div>
      {/* Quick Stats */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Today's Activity
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Activity" size={16} className="text-primary" />
              <span className="text-xs font-medium text-foreground">
                Data Syncs
              </span>
            </div>
            <div className="text-lg font-bold font-data text-foreground">
              24
            </div>
          </div>
          
          <div className="p-3 bg-secondary/10 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Clock" size={16} className="text-secondary" />
              <span className="text-xs font-medium text-foreground">
                Uptime
              </span>
            </div>
            <div className="text-lg font-bold font-data text-foreground">
              23.5h
            </div>
          </div>
        </div>
      </div>
      {/* Connection History */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Recent Activity
        </h3>
        <div className="space-y-2">
          {connectionHistory?.slice(0, 3)?.map((event, index) => (
            <div key={index} className="flex items-center space-x-3 text-xs">
              <div className={`w-2 h-2 rounded-full ${
                event?.status === 'connected' ? 'bg-success' : 'bg-error'
              }`} />
              <span className="text-muted-foreground font-caption">
                {event?.status === 'connected' ? 'Connected' : 'Disconnected'}
              </span>
              <span className="text-muted-foreground font-caption">
                {formatLastSync(event?.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          variant="default"
          size="sm"
          onClick={handleDeviceAction}
          className="flex-1"
          iconName="Settings"
          iconPosition="left"
        >
          Manage Device
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {/* Refresh sensor data */}}
          iconName="RefreshCw"
          iconPosition="left"
        >
          Sync Now
        </Button>
      </div>
      {/* Status Message */}
      {!deviceStatus?.connected && (
        <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <span className="text-sm text-error">
              Device disconnected. Check power and WiFi connection.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceStatusCard;