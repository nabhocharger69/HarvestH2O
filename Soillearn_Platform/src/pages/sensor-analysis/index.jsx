import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SensorAnalysis = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('student');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedSensor, setSelectedSensor] = useState('all');
  const [sensorData, setSensorData] = useState({});

  // Mock sensor data for different time ranges
  const mockSensorData = {
    '1d': {
      moisture: Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        value: 45 + Math.random() * 20,
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000)
      })),
      temperature: Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        value: 20 + Math.random() * 8,
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000)
      })),
      humidity: Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        value: 55 + Math.random() * 25,
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000)
      })),
      light: Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        value: 300 + Math.random() * 400,
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000)
      }))
    },
    '7d': {
      moisture: Array.from({ length: 7 }, (_, i) => ({
        time: `Dec ${7 + i}`,
        value: 45 + Math.random() * 20,
        timestamp: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
      })),
      temperature: Array.from({ length: 7 }, (_, i) => ({
        time: `Dec ${7 + i}`,
        value: 20 + Math.random() * 8,
        timestamp: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
      })),
      humidity: Array.from({ length: 7 }, (_, i) => ({
        time: `Dec ${7 + i}`,
        value: 55 + Math.random() * 25,
        timestamp: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
      })),
      light: Array.from({ length: 7 }, (_, i) => ({
        time: `Dec ${7 + i}`,
        value: 300 + Math.random() * 400,
        timestamp: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
      }))
    }
  };

  useEffect(() => {
    setSensorData(mockSensorData?.[selectedTimeRange]);
  }, [selectedTimeRange]);

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    if (newRole === 'teacher') {
      navigate('/teacher-dashboard');
    }
  };

  const sensorConfigs = {
    moisture: { name: 'Soil Moisture', unit: '%', color: '#3b82f6', optimal: { min: 60, max: 80 } },
    temperature: { name: 'Temperature', unit: '°C', color: '#ef4444', optimal: { min: 22, max: 26 } },
    humidity: { name: 'Humidity', unit: '%', color: '#06b6d4', optimal: { min: 60, max: 70 } },
    light: { name: 'Light Intensity', unit: 'lux', color: '#f59e0b', optimal: { min: 800, max: 1200 } }
  };

  const timeRanges = [
    { value: '1d', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' }
  ];

  const sensorOptions = [
    { value: 'all', label: 'All Sensors' },
    { value: 'moisture', label: 'Soil Moisture' },
    { value: 'temperature', label: 'Temperature' },
    { value: 'humidity', label: 'Humidity' },
    { value: 'light', label: 'Light Intensity' }
  ];

  const calculateStats = (data) => {
    if (!data?.length) return { avg: 0, min: 0, max: 0 };
    
    const values = data?.map(d => d?.value);
    return {
      avg: values?.reduce((sum, val) => sum + val, 0) / values?.length,
      min: Math.min(...values),
      max: Math.max(...values)
    };
  };

  const getStatusColor = (value, optimal) => {
    if (!optimal) return 'text-foreground';
    if (value >= optimal?.min && value <= optimal?.max) return 'text-success';
    if (value < optimal?.min * 0.8 || value > optimal?.max * 1.2) return 'text-error';
    return 'text-warning';
  };

  const renderChart = (sensorType, data) => {
    const config = sensorConfigs?.[sensorType];
    if (!config || !data?.length) return null;

    return (
      <div key={sensorType} className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">{config?.name}</h3>
          <div className="text-right">
            {(() => {
              const stats = calculateStats(data);
              return (
                <div className="text-sm">
                  <div className={`font-medium ${getStatusColor(stats?.avg, config?.optimal)}`}>
                    Avg: {stats?.avg?.toFixed(1)}{config?.unit}
                  </div>
                  <div className="text-muted-foreground">
                    {stats?.min?.toFixed(1)} - {stats?.max?.toFixed(1)}{config?.unit}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                fontSize={12}
                className="text-muted-foreground"
              />
              <YAxis 
                fontSize={12}
                className="text-muted-foreground"
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                formatter={(value) => [`${value?.toFixed(1)}${config?.unit}`, config?.name]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={config?.color}
                strokeWidth={2}
                dot={{ fill: config?.color, strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: config?.color, strokeWidth: 2 }}
              />
              {config?.optimal && (
                <>
                  <Line
                    type="monotone"
                    dataKey={() => config?.optimal?.min}
                    stroke={config?.color}
                    strokeDasharray="5 5"
                    strokeOpacity={0.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey={() => config?.optimal?.max}
                    stroke={config?.color}
                    strokeDasharray="5 5"
                    strokeOpacity={0.5}
                    dot={false}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {config?.optimal && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Optimal Range</p>
            <p className="text-sm font-medium text-foreground">
              {config?.optimal?.min}{config?.unit} - {config?.optimal?.max}{config?.unit}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole={userRole}
        userName="Student"
        onRoleChange={handleRoleChange}
        onToggle={() => {}}
        onNotificationClick={() => {}}
        onMarkAsRead={() => {}}
        onMarkAllAsRead={() => {}}
      />
      <main className="content-offset px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/student-dashboard')}
                  iconName="ArrowLeft"
                  iconSize={16}
                >
                  Back to Dashboard
                </Button>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Sensor Data Analysis 📊
              </h1>
              <p className="text-muted-foreground">
                Review and analyze environmental sensor readings for your plant
              </p>
            </div>

            <Button
              onClick={() => navigate('/device-connection')}
              iconName="Settings"
              iconSize={16}
            >
              Device Settings
            </Button>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Time Range
              </label>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e?.target?.value)}
                className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {timeRanges?.map((range) => (
                  <option key={range?.value} value={range?.value}>
                    {range?.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Sensor Type
              </label>
              <select
                value={selectedSensor}
                onChange={(e) => setSelectedSensor(e?.target?.value)}
                className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {sensorOptions?.map((option) => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {Object.entries(sensorConfigs)?.map(([key, config]) => {
              const data = sensorData?.[key] || [];
              const stats = calculateStats(data);
              const currentValue = data?.[data?.length - 1]?.value || 0;
              
              return (
                <div key={key} className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-foreground">{config?.name}</h3>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${config?.color}20` }}>
                      <Icon name="Activity" size={16} style={{ color: config?.color }} />
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${getStatusColor(currentValue, config?.optimal)}`}>
                    {currentValue?.toFixed(1)}{config?.unit}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Avg: {stats?.avg?.toFixed(1)}{config?.unit}
                  </div>
                  {config?.optimal && (
                    <div className="mt-2 text-xs">
                      <span className="text-muted-foreground">Optimal: </span>
                      <span className="text-foreground">
                        {config?.optimal?.min}-{config?.optimal?.max}{config?.unit}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectedSensor === 'all' 
              ? Object.entries(sensorData)?.map(([sensorType, data]) => 
                  renderChart(sensorType, data)
                )
              : renderChart(selectedSensor, sensorData?.[selectedSensor])
            }
          </div>

          {/* Insights */}
          <div className="mt-8 bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Analysis Insights
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Plant Health Status
                </h4>
                <div className="space-y-2">
                  {Object.entries(sensorConfigs)?.map(([key, config]) => {
                    const data = sensorData?.[key] || [];
                    const currentValue = data?.[data?.length - 1]?.value || 0;
                    const status = config?.optimal 
                      ? (currentValue >= config?.optimal?.min && currentValue <= config?.optimal?.max 
                          ? 'optimal' 
                          : currentValue < config?.optimal?.min * 0.8 || currentValue > config?.optimal?.max * 1.2 
                            ? 'critical' :'warning')
                      : 'normal';
                    
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{config?.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          status === 'optimal' ? 'bg-success/10 text-success' :
                          status === 'warning' ? 'bg-warning/10 text-warning' :
                          status === 'critical'? 'bg-error/10 text-error' : 'bg-muted/10 text-muted-foreground'
                        }`}>
                          {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Recommendations
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Monitor soil moisture levels more frequently</p>
                  <p>• Consider adjusting light exposure during peak hours</p>
                  <p>• Temperature is within optimal range - good job!</p>
                  <p>• Humidity levels could be improved with misting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SensorAnalysis;