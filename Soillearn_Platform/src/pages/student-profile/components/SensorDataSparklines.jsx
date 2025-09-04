import React, { useState } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';


const SensorDataSparklines = ({ sensorData }) => {
  const [selectedSensor, setSelectedSensor] = useState('moisture');

  const sensorConfig = {
    moisture: {
      label: 'Soil Moisture',
      icon: 'Droplets',
      color: 'var(--color-secondary)',
      unit: '%',
      ideal: { min: 40, max: 70 }
    },
    temperature: {
      label: 'Temperature',
      icon: 'Thermometer',
      color: 'var(--color-accent)',
      unit: '°C',
      ideal: { min: 18, max: 25 }
    },
    humidity: {
      label: 'Humidity',
      icon: 'Cloud',
      color: 'var(--color-primary)',
      unit: '%',
      ideal: { min: 50, max: 80 }
    },
    light: {
      label: 'Light Intensity',
      icon: 'Sun',
      color: 'var(--color-warning)',
      unit: 'lux',
      ideal: { min: 200, max: 800 }
    },
    ph: {
      label: 'Soil pH',
      icon: 'Beaker',
      color: 'var(--color-error)',
      unit: 'pH',
      ideal: { min: 6.0, max: 7.5 }
    },
    pressure: {
      label: 'Air Pressure',
      icon: 'Gauge',
      color: 'var(--color-muted-foreground)',
      unit: 'hPa',
      ideal: { min: 1010, max: 1030 }
    }
  };

  const getCurrentValue = (sensorType) => {
    const latestReading = sensorData?.[sensorType]?.slice(-1)?.[0];
    return latestReading ? latestReading?.value : 0;
  };

  const getValueStatus = (sensorType, value) => {
    const config = sensorConfig?.[sensorType];
    if (value >= config?.ideal?.min && value <= config?.ideal?.max) {
      return 'optimal';
    } else if (value < config?.ideal?.min * 0.8 || value > config?.ideal?.max * 1.2) {
      return 'critical';
    }
    return 'warning';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal': return 'text-success';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'optimal': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'critical': return 'AlertCircle';
      default: return 'Minus';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const config = sensorConfig?.[selectedSensor];
      return (
        <div className="bg-popover border border-border rounded-md shadow-modal p-3">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">
            {config?.label}: {payload?.[0]?.value}{config?.unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-foreground">Sensor Data Overview</h2>
        
        <div className="flex items-center gap-2">
          <Icon name="Activity" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-caption">Last 24 hours</span>
        </div>
      </div>
      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Object.entries(sensorConfig)?.map(([key, config]) => {
          const currentValue = getCurrentValue(key);
          const status = getValueStatus(key, currentValue);
          const data = sensorData?.[key] || [];

          return (
            <div
              key={key}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                selectedSensor === key 
                  ? 'border-primary bg-primary/5' :'border-border hover:border-muted-foreground/50'
              }`}
              onClick={() => setSelectedSensor(key)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon name={config?.icon} size={16} style={{ color: config?.color }} />
                  <span className="text-sm font-medium text-foreground">{config?.label}</span>
                </div>
                <Icon 
                  name={getStatusIcon(status)} 
                  size={14} 
                  className={getStatusColor(status)} 
                />
              </div>
              <div className="flex items-end justify-between mb-2">
                <div>
                  <div className="text-xl font-bold text-foreground font-data">
                    {currentValue}{config?.unit}
                  </div>
                  <div className="text-xs text-muted-foreground font-caption">
                    Ideal: {config?.ideal?.min}-{config?.ideal?.max}{config?.unit}
                  </div>
                </div>
              </div>
              {/* Mini Sparkline */}
              <div className="h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.slice(-12)}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={config?.color}
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
      {/* Detailed Chart for Selected Sensor */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon 
            name={sensorConfig?.[selectedSensor]?.icon} 
            size={20} 
            style={{ color: sensorConfig?.[selectedSensor]?.color }} 
          />
          <h3 className="text-lg font-semibold text-foreground">
            {sensorConfig?.[selectedSensor]?.label} - Detailed View
          </h3>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sensorData?.[selectedSensor] || []}>
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={sensorConfig?.[selectedSensor]?.color}
                strokeWidth={2}
                dot={{ fill: sensorConfig?.[selectedSensor]?.color, strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Growth Stage Correlation */}
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Leaf" size={16} className="text-secondary" />
            <span className="text-sm font-medium text-foreground">Growth Stage Correlation</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Current readings indicate optimal conditions for the vegetative growth stage. 
            {sensorConfig?.[selectedSensor]?.label} levels are within the ideal range for healthy plant development.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SensorDataSparklines;