import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeviceDashboard = () => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  // Fetch sensor data from ESP32 endpoint
  const fetchSensorData = useCallback(async () => {
    try {
      setError(null);
      setConnectionStatus('connecting');
      
      const response = await fetch('http://10.173.244.46:5000/latest', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('ESP32 Data received:', data);
      
      if (data.ok && data.latest) {
        setSensorData(data);
        setLastUpdate(new Date());
        setConnectionStatus('connected');
        
        // Store in dataManager for historical tracking
        try {
          const { default: dataManager } = await import('../../../utils/dataManager');
          dataManager.addESP32SensorData(data.latest);
        } catch (dmError) {
          console.warn('Failed to store sensor data:', dmError);
        }
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      console.error('Error fetching sensor data:', err);
      setError(err.message);
      setConnectionStatus('disconnected');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh functionality - every 5 seconds
  useEffect(() => {
    let interval;
    
    if (autoRefresh) {
      // Initial fetch
      fetchSensorData();
      
      // Set up interval for auto-refresh every 5 seconds
      interval = setInterval(fetchSensorData, 5000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh, fetchSensorData]);

  // Manual refresh
  const handleManualRefresh = () => {
    setLoading(true);
    fetchSensorData();
  };

  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'connecting': return 'text-warning';
      case 'disconnected': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'Wifi';
      case 'connecting': return 'Loader';
      case 'disconnected': return 'WifiOff';
      default: return 'AlertCircle';
    }
  };

  // Format sensor values
  const formatValue = (value, unit, decimals = 2) => {
    if (value == null || value === undefined) return 'N/A';
    return `${Number(value).toFixed(decimals)}${unit}`;
  };

  // Get sensor card color based on value ranges
  const getSensorCardClass = (type, value) => {
    const baseClass = "bg-card rounded-lg border border-border shadow-card p-4 transition-all hover:shadow-lg";
    
    if (value == null || value === undefined) return `${baseClass} border-l-4 border-l-muted`;
    
    switch (type) {
      case 'temperature':
        if (value < 15 || value > 35) return `${baseClass} border-l-4 border-l-warning`;
        return `${baseClass} border-l-4 border-l-success`;
      case 'humidity':
        if (value < 30 || value > 80) return `${baseClass} border-l-4 border-l-warning`;
        return `${baseClass} border-l-4 border-l-success`;
      case 'soilMoisture':
        if (value < 2000 || value > 4000) return `${baseClass} border-l-4 border-l-warning`;
        return `${baseClass} border-l-4 border-l-success`;
      case 'co2':
        if (value > 1000) return `${baseClass} border-l-4 border-l-error`;
        if (value > 800) return `${baseClass} border-l-4 border-l-warning`;
        return `${baseClass} border-l-4 border-l-success`;
      case 'npk':
        if (value < 50 || value > 150) return `${baseClass} border-l-4 border-l-warning`;
        return `${baseClass} border-l-4 border-l-success`;
      default:
        return baseClass;
    }
  };

  if (loading && !sensorData) {
    return (
      <div className="space-y-6">
        <div className="bg-card rounded-lg border border-border shadow-card p-6">
          <div className="flex items-center justify-center space-y-4">
            <div className="text-center">
              <Icon name="Loader" size={32} className="text-muted-foreground animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Connecting to Device</h3>
              <p className="text-muted-foreground">Fetching real-time sensor data from ESP32...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !sensorData) {
    return (
      <div className="space-y-6">
        <div className="bg-card rounded-lg border border-border shadow-card p-6">
          <div className="text-center">
            <Icon name="AlertCircle" size={32} className="text-error mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Connection Error</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleManualRefresh} iconName="RefreshCw">
              Retry Connection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Extract sensor data from ESP32 payload
  const sensors = sensorData?.latest?.client_payload?.sensors;
  const deviceId = sensorData?.latest?.client_payload?.device;
  const timestamp = sensorData?.latest?.client_payload?.ts;

  return (
    <div className="space-y-6">
      {/* Device Status Header */}
      <div className="bg-card rounded-lg border border-border shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Smartphone" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Real-time Data Feed</h2>
              <p className="text-sm text-muted-foreground">Live sensor readings - Updates every 5 seconds</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAutoRefresh}
              iconName={autoRefresh ? "Pause" : "Play"}
            >
              {autoRefresh ? "Pause" : "Start"} Auto-refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              iconName="RefreshCw"
              disabled={loading}
              className={loading ? "animate-spin" : ""}
            >
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Icon 
              name={getStatusIcon(connectionStatus)} 
              size={16} 
              className={`${getStatusColor(connectionStatus)} ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`} 
            />
            <span className="text-sm font-medium text-foreground">
              {connectionStatus === 'connected' ? 'ESP32 Connected' : 
               connectionStatus === 'connecting' ? 'Connecting to ESP32...' : 'ESP32 Disconnected'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon name="Cpu" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Device: {deviceId || 'esp32-env1'}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Last Update: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
            </span>
          </div>
        </div>
      </div>

      {/* Environmental Sensors */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Thermometer" size={20} className="mr-2" />
          Environmental Conditions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Temperature from DHT22 */}
          <div className={getSensorCardClass('temperature', sensors?.dht22?.temp_c)}>
            <div className="flex items-center justify-between mb-2">
              <Icon name="Thermometer" size={20} className="text-red-500" />
              <span className="text-xs text-muted-foreground">DHT22</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {formatValue(sensors?.dht22?.temp_c, '°C')}
              </p>
              <p className="text-sm text-muted-foreground">Temperature</p>
            </div>
          </div>

          {/* 1. Humidity from DHT22 */}
          <div className={getSensorCardClass('humidity', sensors?.dht22?.hum_pct)}>
            <div className="flex items-center justify-between mb-2">
              <Icon name="Droplets" size={20} className="text-blue-500" />
              <span className="text-xs text-muted-foreground">DHT22</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {formatValue(sensors?.dht22?.hum_pct, '%')}
              </p>
              <p className="text-sm text-muted-foreground">Humidity</p>
            </div>
          </div>

          {/* 5. Atmospheric Pressure from BMP280 */}
          <div className="bg-card rounded-lg border border-border shadow-card p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Gauge" size={20} className="text-purple-500" />
              <span className="text-xs text-muted-foreground">BMP280</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {formatValue(sensors?.bmp280?.press_hpa, ' hPa')}
              </p>
              <p className="text-sm text-muted-foreground">Atmospheric Pressure</p>
            </div>
          </div>

          {/* 5. Altitude from BMP280 */}
          <div className="bg-card rounded-lg border border-border shadow-card p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Mountain" size={20} className="text-green-600" />
              <span className="text-xs text-muted-foreground">BMP280</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {formatValue(sensors?.bmp280?.alt_m, ' mts.')}
              </p>
              <p className="text-sm text-muted-foreground">Altitude</p>
            </div>
          </div>
        </div>
      </div>

      {/* Light Sensors */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Sun" size={20} className="mr-2" />
          Light Conditions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 4. Light Intensity from BH1750 */}
          <div className="bg-card rounded-lg border border-border shadow-card p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Sun" size={20} className="text-yellow-500" />
              <span className="text-xs text-muted-foreground">BH1750</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {formatValue(sensors?.bh1750?.lux, ' lux')}
              </p>
              <p className="text-sm text-muted-foreground">Light Intensity</p>
            </div>
          </div>

          {/* 3. Ambient Brightness */}
          <div className="bg-card rounded-lg border border-border shadow-card p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Lightbulb" size={20} className="text-orange-500" />
              <span className="text-xs text-muted-foreground">Ambient</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {formatValue(sensors?.ambient_brightness?.lux, ' lux')}
              </p>
              <p className="text-sm text-muted-foreground">Ambient Brightness</p>
            </div>
          </div>
        </div>
      </div>

      {/* Soil Monitoring */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Sprout" size={20} className="mr-2" />
          Soil Monitoring
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 7. Soil Moisture from HS-S20B */}
          <div className={getSensorCardClass('soilMoisture', sensors?.hs_s20b?.adc_raw)}>
            <div className="flex items-center justify-between mb-2">
              <Icon name="Droplets" size={20} className="text-blue-600" />
              <span className="text-xs text-muted-foreground">HS-S20B</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {formatValue(sensors?.hs_s20b?.adc_raw, '')}
              </p>
              <p className="text-sm text-muted-foreground">Soil Moisture</p>
            </div>
          </div>

          {/* 2. Nitrogen from NPK */}
          <div className={getSensorCardClass('npk', sensors?.npk?.n_mgkg)}>
            <div className="flex items-center justify-between mb-2">
              <Icon name="Leaf" size={20} className="text-green-500" />
              <span className="text-xs text-muted-foreground">NPK</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {formatValue(sensors?.npk?.n_mgkg, '')}
              </p>
              <p className="text-sm text-muted-foreground">Nitrogen</p>
            </div>
          </div>

          {/* 2. Phosphorus from NPK */}
          <div className={getSensorCardClass('npk', sensors?.npk?.p_mgkg)}>
            <div className="flex items-center justify-between mb-2">
              <Icon name="Zap" size={20} className="text-purple-500" />
              <span className="text-xs text-muted-foreground">NPK</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {formatValue(sensors?.npk?.p_mgkg, '')}
              </p>
              <p className="text-sm text-muted-foreground">Phosphorus</p>
            </div>
          </div>

          {/* 2. Potassium from NPK */}
          <div className={getSensorCardClass('npk', sensors?.npk?.k_mgkg)}>
            <div className="flex items-center justify-between mb-2">
              <Icon name="Zap" size={20} className="text-orange-500" />
              <span className="text-xs text-muted-foreground">NPK</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {formatValue(sensors?.npk?.k_mgkg, '')}
              </p>
              <p className="text-sm text-muted-foreground">Potassium</p>
            </div>
          </div>
        </div>
      </div>

      {/* Air Quality & Location */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="MapPin" size={20} className="mr-2" />
          Air Quality & Location Data
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 8. CO2 Level from MH-Z19E */}
          <div className={getSensorCardClass('co2', sensors?.mh_z19e?.co2_ppm)}>
            <div className="flex items-center justify-between mb-2">
              <Icon name="Wind" size={20} className="text-gray-600" />
              <span className="text-xs text-muted-foreground">MH-Z19E</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {formatValue(sensors?.mh_z19e?.co2_ppm, ' ppm')}
              </p>
              <p className="text-sm text-muted-foreground">CO2 Level</p>
            </div>
          </div>

          {/* 6. Latitude from GPS */}
          <div className="bg-card rounded-lg border border-border shadow-card p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="MapPin" size={20} className="text-red-500" />
              <span className="text-xs text-muted-foreground">GPS</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {formatValue(sensors?.gps?.lat, '°')}
              </p>
              <p className="text-sm text-muted-foreground">Latitude</p>
            </div>
          </div>

          {/* 6. Longitude from GPS */}
          <div className="bg-card rounded-lg border border-border shadow-card p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="MapPin" size={20} className="text-blue-500" />
              <span className="text-xs text-muted-foreground">GPS</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {formatValue(sensors?.gps?.lon, '°')}
              </p>
              <p className="text-sm text-muted-foreground">Longitude</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Timestamp */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} />
            <span>Data Timestamp: {timestamp ? new Date(timestamp).toLocaleString() : 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Database" size={16} />
            <span>Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDashboard;
