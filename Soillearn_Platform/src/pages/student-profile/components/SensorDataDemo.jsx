import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SensorDataDemo = () => {
  const [isLive, setIsLive] = useState(false);
  const [sensorData, setSensorData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastUpdate, setLastUpdate] = useState(null);

  // Simulate real ESP32 data for demonstration
  const generateMockSensorData = () => {
    const baseTime = new Date().toISOString();
    return {
      ok: true,
      latest: {
        client_payload: {
          device: "esp32-env1",
          sensors: {
            dht22: {
              temp_c: 25.4 + (Math.random() - 0.5) * 2, // 24.4 - 26.4°C
              hum_pct: 99.9 + (Math.random() - 0.5) * 5  // 97.4 - 102.4%
            },
            bmp280: {
              temp_c: 26.17 + (Math.random() - 0.5) * 1.5,
              press_hpa: 984.83 + (Math.random() - 0.5) * 10,
              alt_m: 239.36 + (Math.random() - 0.5) * 5
            },
            bh1750: {
              lux: 434.99 + (Math.random() - 0.5) * 100
            },
            ambient_brightness: {
              lux: 117 + (Math.random() - 0.5) * 50
            },
            mh_z19e: {
              co2_ppm: 443 + Math.floor((Math.random() - 0.5) * 100)
            },
            hs_s20b: {
              adc_raw: 4095,
              ratio: 0.95 + Math.random() * 0.1 // 0.95 - 1.05
            },
            npk: {
              n_mgkg: 78 + Math.floor((Math.random() - 0.5) * 10),
              p_mgkg: 55 + Math.floor((Math.random() - 0.5) * 8),
              k_mgkg: 74 + Math.floor((Math.random() - 0.5) * 12)
            },
            gps: {
              lat: 28.544485 + (Math.random() - 0.5) * 0.0001,
              lon: 77.333141 + (Math.random() - 0.5) * 0.0001,
              alt_m: 209 + Math.floor((Math.random() - 0.5) * 10),
              sat: 11 + Math.floor((Math.random() - 0.5) * 2),
              hdop: 1.1 + (Math.random() - 0.5) * 0.2
            }
          },
          ts: baseTime
        },
        server_time_iso_local: baseTime
      }
    };
  };

  // Fetch real sensor data with fallback to demo
  const fetchSensorData = async () => {
    try {
      setConnectionStatus('connecting');
      
      // Try to fetch real data first
      const response = await fetch('http://10.173.244.46:5000/latest', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        timeout: 5000
      });

      if (response.ok) {
        const data = await response.json();
        setSensorData(data);
        setConnectionStatus('connected');
        setLastUpdate(new Date());
        return;
      }
    } catch (error) {
      console.log('Real ESP32 not available, using demo data:', error.message);
    }

    // Fallback to demo data
    const demoData = generateMockSensorData();
    setSensorData(demoData);
    setConnectionStatus('demo');
    setLastUpdate(new Date());
  };

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    
    if (isLive) {
      fetchSensorData(); // Initial fetch
      interval = setInterval(fetchSensorData, 2000); // Update every 2 seconds for demo
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive]);

  const toggleLiveData = () => {
    setIsLive(!isLive);
    if (!isLive) {
      fetchSensorData();
    } else {
      setConnectionStatus('disconnected');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'demo': return 'text-primary';
      case 'connecting': return 'text-warning';
      default: return 'text-error';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected': return 'Live ESP32 Data';
      case 'demo': return 'Demo Mode';
      case 'connecting': return 'Connecting...';
      default: return 'Disconnected';
    }
  };

  const formatValue = (value, unit, decimals = 1) => {
    if (value == null) return 'N/A';
    return `${Number(value).toFixed(decimals)}${unit}`;
  };

  const sensors = sensorData?.latest?.client_payload?.sensors;

  return (
    <div className="space-y-6">
      {/* Demo Control Panel */}
      <div className="bg-card rounded-lg border border-border shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Real-time Sensor Data Preview</h2>
            <p className="text-sm text-muted-foreground">
              Live demonstration of ESP32 sensor data transmission
            </p>
          </div>
          <Button
            onClick={toggleLiveData}
            variant={isLive ? "destructive" : "default"}
            iconName={isLive ? "Square" : "Play"}
          >
            {isLive ? "Stop Live Data" : "Start Live Demo"}
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-success animate-pulse' :
              connectionStatus === 'demo' ? 'bg-primary animate-pulse' :
              connectionStatus === 'connecting' ? 'bg-warning animate-pulse' :
              'bg-error'
            }`}></div>
            <span className={`text-sm font-medium ${getStatusColor(connectionStatus)}`}>
              {getStatusText(connectionStatus)}
            </span>
          </div>
          
          {lastUpdate && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Clock" size={14} />
              <span>Last Update: {lastUpdate.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Live Sensor Data Display */}
      {sensorData && (
        <div className="space-y-6">
          {/* Environmental Data */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Thermometer" size={20} className="mr-2" />
              Environmental Conditions
              {isLive && <div className="ml-2 w-2 h-2 bg-success rounded-full animate-pulse"></div>}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card rounded-lg border border-border shadow-card p-4 border-l-4 border-l-primary">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Thermometer" size={20} className="text-primary" />
                  <span className="text-xs text-muted-foreground">DHT22</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground animate-pulse">
                    {formatValue(sensors?.dht22?.temp_c, '°C')}
                  </p>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border shadow-card p-4 border-l-4 border-l-secondary">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Droplets" size={20} className="text-secondary" />
                  <span className="text-xs text-muted-foreground">DHT22</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground animate-pulse">
                    {formatValue(sensors?.dht22?.hum_pct, '%')}
                  </p>
                  <p className="text-sm text-muted-foreground">Humidity</p>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border shadow-card p-4 border-l-4 border-l-accent">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Gauge" size={20} className="text-accent" />
                  <span className="text-xs text-muted-foreground">BMP280</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground animate-pulse">
                    {formatValue(sensors?.bmp280?.press_hpa, ' hPa', 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Pressure</p>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border shadow-card p-4 border-l-4 border-l-warning">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Wind" size={20} className="text-warning" />
                  <span className="text-xs text-muted-foreground">MH-Z19E</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground animate-pulse">
                    {formatValue(sensors?.mh_z19e?.co2_ppm, ' ppm', 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">CO₂ Level</p>
                </div>
              </div>
            </div>
          </div>

          {/* Soil Monitoring */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Sprout" size={20} className="mr-2" />
              Soil Monitoring
              {isLive && <div className="ml-2 w-2 h-2 bg-success rounded-full animate-pulse"></div>}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card rounded-lg border border-border shadow-card p-4 border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Droplets" size={20} className="text-blue-500" />
                  <span className="text-xs text-muted-foreground">HS-S20B</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground animate-pulse">
                    {formatValue(sensors?.hs_s20b?.ratio * 100, '%', 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Soil Moisture</p>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border shadow-card p-4 border-l-4 border-l-green-500">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Leaf" size={20} className="text-green-500" />
                  <span className="text-xs text-muted-foreground">NPK</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground animate-pulse">
                    {formatValue(sensors?.npk?.n_mgkg, '', 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Nitrogen (mg/kg)</p>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border shadow-card p-4 border-l-4 border-l-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Zap" size={20} className="text-purple-500" />
                  <span className="text-xs text-muted-foreground">NPK</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground animate-pulse">
                    {formatValue(sensors?.npk?.p_mgkg, '', 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Phosphorus (mg/kg)</p>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border shadow-card p-4 border-l-4 border-l-orange-500">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Zap" size={20} className="text-orange-500" />
                  <span className="text-xs text-muted-foreground">NPK</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground animate-pulse">
                    {formatValue(sensors?.npk?.k_mgkg, '', 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Potassium (mg/kg)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Transmission Info */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Cpu" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Device: {sensorData?.latest?.client_payload?.device}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Wifi" size={16} className={getStatusColor(connectionStatus)} />
                  <span className={getStatusColor(connectionStatus)}>
                    {getStatusText(connectionStatus)}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="RefreshCw" size={16} className={isLive ? "animate-spin" : ""} />
                <span>Update Rate: {isLive ? "2 seconds" : "Stopped"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!sensorData && (
        <div className="bg-card rounded-lg border border-border shadow-card p-6 text-center">
          <Icon name="Play" size={32} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Start Live Demo</h3>
          <p className="text-muted-foreground mb-4">
            Click "Start Live Demo" to see real-time sensor data transmission in action
          </p>
          <p className="text-sm text-muted-foreground">
            The demo will attempt to connect to your ESP32 device, or use simulated data for demonstration
          </p>
        </div>
      )}
    </div>
  );
};

export default SensorDataDemo;
