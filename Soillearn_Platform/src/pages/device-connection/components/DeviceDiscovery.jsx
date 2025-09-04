import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const DeviceDiscovery = ({ isScanning, onDeviceSelect, onStartScan, onStopScan }) => {
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [scanProgress, setScanProgress] = useState(0);

  // Mock discovered devices
  const mockDevices = [
    {
      id: "ESP32_001",
      name: "SoilLearn Monitor #1",
      macAddress: "24:6F:28:AB:CD:EF",
      signalStrength: 85,
      deviceType: "ESP32-WROOM-32",
      isCompatible: true,
      lastSeen: Date.now() - 2000
    },
    {
      id: "ESP32_002", 
      name: "SoilLearn Monitor #2",
      macAddress: "24:6F:28:AB:CD:F0",
      signalStrength: 62,
      deviceType: "ESP32-WROOM-32",
      isCompatible: true,
      lastSeen: Date.now() - 8000
    },
    {
      id: "ESP32_003",
      name: "Unknown ESP32",
      macAddress: "24:6F:28:AB:CD:F1", 
      signalStrength: 45,
      deviceType: "ESP32-DevKitC",
      isCompatible: false,
      lastSeen: Date.now() - 15000
    }
  ];

  useEffect(() => {
    let interval;
    if (isScanning) {
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            // Simulate finding devices
            setDiscoveredDevices(mockDevices);
            onStopScan();
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    } else {
      setScanProgress(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isScanning, onStopScan]);

  const getSignalIcon = (strength) => {
    if (strength >= 70) return { icon: 'Wifi', color: 'text-success' };
    if (strength >= 50) return { icon: 'Wifi', color: 'text-secondary' };
    if (strength >= 30) return { icon: 'Wifi', color: 'text-warning' };
    return { icon: 'Wifi', color: 'text-error' };
  };

  const formatLastSeen = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <Icon name="Radar" size={24} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Device Discovery</h3>
            <p className="text-sm text-muted-foreground font-caption">
              {isScanning ? 'Scanning for devices...' : `${discoveredDevices?.length} devices found`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isScanning ? (
            <button
              onClick={onStartScan}
              className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors focus-ring"
            >
              <Icon name="Search" size={16} />
              <span className="font-medium">Scan</span>
            </button>
          ) : (
            <button
              onClick={onStopScan}
              className="flex items-center space-x-2 px-4 py-2 bg-error text-error-foreground rounded-md hover:bg-error/90 transition-colors focus-ring"
            >
              <Icon name="Square" size={16} />
              <span className="font-medium">Stop</span>
            </button>
          )}
        </div>
      </div>
      {/* Scanning Progress */}
      {isScanning && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Scanning Progress</span>
            <span className="text-sm text-muted-foreground font-data">{scanProgress}%</span>
          </div>
          <div className="progress-bar h-2">
            <div 
              className="progress-fill"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Icon name="Loader" size={16} className="text-secondary animate-spin" />
            <span className="text-sm text-muted-foreground font-caption">
              Searching for ESP32 devices in range...
            </span>
          </div>
        </div>
      )}
      {/* Discovered Devices */}
      {discoveredDevices?.length === 0 && !isScanning ? (
        <div className="text-center py-8">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">No devices found</p>
          <p className="text-sm text-muted-foreground font-caption">
            Make sure your ESP32 device is powered on and in pairing mode
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {discoveredDevices?.map((device) => {
            const signal = getSignalIcon(device?.signalStrength);
            
            return (
              <div
                key={device?.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  device?.isCompatible
                    ? 'border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer' :'border-error/30 bg-error/5 cursor-not-allowed opacity-75'
                }`}
                onClick={() => device?.isCompatible && onDeviceSelect(device)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Device Icon */}
                    <div className={`p-2 rounded-lg ${
                      device?.isCompatible ? 'bg-primary/10' : 'bg-error/10'
                    }`}>
                      <Icon 
                        name="Smartphone" 
                        size={20} 
                        className={device?.isCompatible ? 'text-primary' : 'text-error'}
                      />
                    </div>

                    {/* Device Info */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-foreground">{device?.name}</h4>
                        {device?.isCompatible ? (
                          <Icon name="CheckCircle" size={16} className="text-success" />
                        ) : (
                          <Icon name="AlertTriangle" size={16} className="text-error" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground font-data">{device?.macAddress}</p>
                      <p className="text-xs text-muted-foreground font-caption">
                        {device?.deviceType} • Last seen {formatLastSeen(device?.lastSeen)}
                      </p>
                    </div>
                  </div>

                  {/* Signal Strength & Actions */}
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Icon name={signal?.icon} size={16} className={signal?.color} />
                        <span className="text-sm font-data text-foreground">
                          {device?.signalStrength}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-caption">Signal</p>
                    </div>

                    {device?.isCompatible && (
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          onDeviceSelect(device);
                        }}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors focus-ring text-sm"
                      >
                        <Icon name="Link" size={14} />
                        <span>Connect</span>
                      </button>
                    )}
                  </div>
                </div>
                {/* Compatibility Warning */}
                {!device?.isCompatible && (
                  <div className="mt-3 p-2 bg-error/10 border border-error/20 rounded-md">
                    <div className="flex items-center space-x-2">
                      <Icon name="AlertTriangle" size={14} className="text-error" />
                      <span className="text-xs text-error font-caption">
                        This device is not compatible with SoilLearn
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {/* Scan Tips */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="text-sm font-medium text-foreground mb-1">Scanning Tips</h5>
            <ul className="text-xs text-muted-foreground space-y-1 font-caption">
              <li>• Ensure your ESP32 device is within 10 meters</li>
              <li>• Check that the device LED is blinking green (pairing mode)</li>
              <li>• Try rescanning if your device doesn't appear</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDiscovery;