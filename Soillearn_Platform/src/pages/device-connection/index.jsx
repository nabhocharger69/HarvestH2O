import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import DeviceStatus from './components/DeviceStatus';
import DataFeed from './components/DataFeed';
import ConnectionInstructions from './components/ConnectionInstructions';
import DeviceDiscovery from './components/DeviceDiscovery';
import CalibrationTools from './components/CalibrationTools';
import ConnectionLogs from './components/ConnectionLogs';

const DeviceConnection = () => {
  const navigate = useNavigate();
  const [device, setDevice] = useState({
    id: "esp32-env1",
    status: 'disconnected', // connected, connecting, disconnected, discovering
    macAddress: "24:6F:28:AB:CD:EF",
    firmwareVersion: "v2.1.0",
    signalStrength: 62,
    batteryLevel: 78
  });

  const [sensorData, setSensorData] = useState([
    {
      type: 'moisture',
      value: 45,
      timestamp: Date.now() - 1000,
      trend: 'stable',
      change: 0
    },
    {
      type: 'temperature',
      value: 22.5,
      timestamp: Date.now() - 1500,
      trend: 'up',
      change: 0.3
    },
    {
      type: 'humidity',
      value: 65,
      timestamp: Date.now() - 2000,
      trend: 'down',
      change: -2
    },
    {
      type: 'light',
      value: 1250,
      timestamp: Date.now() - 2500,
      trend: 'up',
      change: 150
    },
    {
      type: 'pressure',
      value: 1013.2,
      timestamp: Date.now() - 3000,
      trend: 'stable',
      change: 0.1
    },
    {
      type: 'nitrogen',
      value: 78.5,
      timestamp: Date.now() - 3500,
      trend: 'stable',
      change: 0
    },
    {
      type: 'phosphorus',
      value: 42.3,
      timestamp: Date.now() - 4000,
      trend: 'stable',
      change: 0
    },
    {
      type: 'potassium',
      value: 65.7,
      timestamp: Date.now() - 4500,
      trend: 'stable',
      change: 0
    }
  ]);

  const [isScanning, setIsScanning] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Simulate real-time data updates when connected
  useEffect(() => {
    let interval;
    if (device?.status === 'connected') {
      interval = setInterval(() => {
        setSensorData(prevData => 
          prevData?.map(sensor => {
            // Keep NPK values constant
            if (sensor.type === 'nitrogen' || sensor.type === 'phosphorus' || sensor.type === 'potassium') {
              return {
                ...sensor,
                timestamp: Date.now(),
                trend: 'stable',
                change: 0
              };
            }
            // Update other sensors with variations
            return {
              ...sensor,
              value: sensor?.value + (Math.random() - 0.5) * 2,
              timestamp: Date.now(),
              trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
              change: (Math.random() - 0.5) * 5
            };
          })
        );
        setLastUpdate(Date.now());
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [device?.status]);

  const handleConnect = () => {
    setDevice(prev => ({ ...prev, status: 'connecting' }));
    
    setTimeout(() => {
      setDevice(prev => ({ 
        ...prev, 
        status: 'connected',
        signalStrength: 85
      }));
    }, 3000);
  };

  const handleDisconnect = () => {
    setDevice(prev => ({ 
      ...prev, 
      status: 'disconnected',
      signalStrength: 0
    }));
  };

  const handleRefresh = () => {
    if (device?.status === 'connected') {
      setSensorData(prevData => 
        prevData?.map(sensor => ({
          ...sensor,
          timestamp: Date.now()
        }))
      );
      setLastUpdate(Date.now());
    }
  };

  const handleStartPairing = () => {
    setIsScanning(true);
  };

  const handleStartScan = () => {
    setIsScanning(true);
  };

  const handleStopScan = () => {
    setIsScanning(false);
  };

  const handleDeviceSelect = (selectedDevice) => {
    setDevice(prev => ({
      ...prev,
      id: selectedDevice?.id,
      macAddress: selectedDevice?.macAddress,
      signalStrength: selectedDevice?.signalStrength,
      status: 'connecting'
    }));

    setTimeout(() => {
      setDevice(prev => ({ ...prev, status: 'connected' }));
      setIsScanning(false);
    }, 2000);
  };

  const handleCalibrate = (sensorType) => {
    // Calibrate sensor
  };

  const handleReset = (sensorType) => {
    // Reset sensor to defaults
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="content-offset px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/student-dashboard')}
                className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg hover:bg-muted/80 transition-colors focus-ring"
                title="Back to Dashboard"
              >
                <Icon name="ArrowLeft" size={20} className="text-muted-foreground" />
              </button>
              
              <div>
                <h1 className="text-3xl font-bold text-foreground">Device Connection</h1>
                <p className="text-muted-foreground font-caption mt-1">
                  Manage your ESP32 sensor device and monitor real-time data
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/daily-quiz')}
                className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors focus-ring"
              >
                <Icon name="Brain" size={16} />
                <span className="hidden sm:inline">Daily Quiz</span>
              </button>
              
              <button
                onClick={() => navigate('/student-dashboard')}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors focus-ring"
              >
                <Icon name="LayoutDashboard" size={16} />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Device Management */}
            <div className="xl:col-span-2 space-y-8">
              {/* Device Status */}
              <DeviceStatus
                device={device}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onRefresh={handleRefresh}
              />

              {/* Data Feed */}
              <DataFeed
                sensorData={sensorData}
                isConnected={device?.status === 'connected'}
                lastUpdate={lastUpdate}
              />

              {/* Device Discovery */}
              <DeviceDiscovery
                isScanning={isScanning}
                onDeviceSelect={handleDeviceSelect}
                onStartScan={handleStartScan}
                onStopScan={handleStopScan}
              />

              {/* Calibration Tools */}
              <CalibrationTools
                isConnected={device?.status === 'connected'}
                onCalibrate={handleCalibrate}
                onReset={handleReset}
              />
            </div>

            {/* Right Column - Instructions & Logs */}
            <div className="space-y-8">
              {/* Connection Instructions */}
              <ConnectionInstructions
                onStartPairing={handleStartPairing}
              />

              {/* Connection Logs */}
              <ConnectionLogs />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-12 p-6 bg-muted/30 rounded-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <Icon name="HelpCircle" size={20} className="text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Need Help?</p>
                  <p className="text-sm text-muted-foreground font-caption">
                    Check our troubleshooting guide or contact support
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors focus-ring">
                  <Icon name="Book" size={16} />
                  <span>User Guide</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors focus-ring">
                  <Icon name="MessageCircle" size={16} />
                  <span>Get Support</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceConnection;