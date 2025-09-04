import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CalibrationTools = ({ isConnected, onCalibrate, onReset }) => {
  const [selectedSensor, setSelectedSensor] = useState('moisture');
  const [calibrationStep, setCalibrationStep] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);

  const sensors = [
    {
      type: 'moisture',
      name: 'Soil Moisture',
      icon: 'Droplets',
      unit: '%',
      description: 'Calibrate soil moisture sensor for accurate readings',
      steps: ['Place sensor in dry soil', 'Record dry reading', 'Place in wet soil', 'Record wet reading']
    },
    {
      type: 'ph',
      name: 'Soil pH',
      icon: 'TestTube',
      unit: 'pH',
      description: 'Calibrate pH sensor using buffer solutions',
      steps: ['Clean sensor probe', 'Test pH 7.0 buffer', 'Test pH 4.0 buffer', 'Test pH 10.0 buffer']
    },
    {
      type: 'temperature',
      name: 'Temperature',
      icon: 'Thermometer',
      unit: '°C',
      description: 'Calibrate temperature sensor accuracy',
      steps: ['Room temperature test', 'Ice water test', 'Warm water test', 'Verify readings']
    },
    {
      type: 'light',
      name: 'Light Intensity',
      icon: 'Sun',
      unit: 'lux',
      description: 'Calibrate light sensor for different conditions',
      steps: ['Dark environment', 'Indoor lighting', 'Bright sunlight', 'Verify range']
    }
  ];

  const handleStartCalibration = async () => {
    setIsCalibrating(true);
    setCalibrationStep(0);
    
    // Simulate calibration process
    for (let i = 0; i < sensors?.find(s => s?.type === selectedSensor)?.steps?.length; i++) {
      setCalibrationStep(i);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    setIsCalibrating(false);
    setCalibrationStep(0);
    if (onCalibrate) onCalibrate(selectedSensor);
  };

  const handleResetSensor = () => {
    if (onReset) onReset(selectedSensor);
  };

  const currentSensor = sensors?.find(s => s?.type === selectedSensor);

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-accent/10 rounded-lg">
          <Icon name="Settings" size={24} className="text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Calibration Tools</h3>
          <p className="text-sm text-muted-foreground font-caption">
            Ensure accurate sensor readings
          </p>
        </div>
      </div>
      {!isConnected ? (
        <div className="text-center py-8">
          <Icon name="AlertCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">Device Not Connected</p>
          <p className="text-sm text-muted-foreground font-caption">
            Connect your ESP32 device to access calibration tools
          </p>
        </div>
      ) : (
        <>
          {/* Sensor Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Select Sensor to Calibrate
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sensors?.map((sensor) => (
                <button
                  key={sensor?.type}
                  onClick={() => setSelectedSensor(sensor?.type)}
                  disabled={isCalibrating}
                  className={`p-4 rounded-lg border text-left transition-all duration-200 focus-ring ${
                    selectedSensor === sensor?.type
                      ? 'border-primary bg-primary/10' :'border-border hover:border-primary/50 hover:bg-muted/50'
                  } ${isCalibrating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={sensor?.icon} 
                      size={20} 
                      className={selectedSensor === sensor?.type ? 'text-primary' : 'text-muted-foreground'}
                    />
                    <div>
                      <h4 className="font-medium text-foreground">{sensor?.name}</h4>
                      <p className="text-xs text-muted-foreground font-caption">
                        {sensor?.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Calibration Process */}
          {currentSensor && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-foreground">
                  {currentSensor?.name} Calibration
                </h4>
                {isCalibrating && (
                  <div className="flex items-center space-x-2 text-secondary">
                    <Icon name="Loader" size={16} className="animate-spin" />
                    <span className="text-sm font-caption">Calibrating...</span>
                  </div>
                )}
              </div>

              {/* Calibration Steps */}
              <div className="space-y-3 mb-6">
                {currentSensor?.steps?.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      isCalibrating && index === calibrationStep
                        ? 'bg-secondary/10 border border-secondary/20'
                        : isCalibrating && index < calibrationStep
                        ? 'bg-success/10 border border-success/20' :'bg-muted/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-data ${
                      isCalibrating && index === calibrationStep
                        ? 'bg-secondary text-secondary-foreground'
                        : isCalibrating && index < calibrationStep
                        ? 'bg-success text-success-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCalibrating && index < calibrationStep ? (
                        <Icon name="Check" size={16} />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${
                        isCalibrating && index === calibrationStep
                          ? 'text-secondary font-medium'
                          : isCalibrating && index < calibrationStep
                          ? 'text-success' :'text-foreground'
                      }`}>
                        {step}
                      </p>
                    </div>
                    {isCalibrating && index === calibrationStep && (
                      <Icon name="Loader" size={16} className="text-secondary animate-spin" />
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleStartCalibration}
                  disabled={isCalibrating}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon name={isCalibrating ? "Loader" : "Play"} size={16} className={isCalibrating ? "animate-spin" : ""} />
                  <span className="font-medium">
                    {isCalibrating ? 'Calibrating...' : 'Start Calibration'}
                  </span>
                </button>

                <button
                  onClick={handleResetSensor}
                  disabled={isCalibrating}
                  className="flex items-center space-x-2 px-4 py-2 bg-warning text-warning-foreground rounded-md hover:bg-warning/90 transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon name="RotateCcw" size={16} />
                  <span className="font-medium">Reset to Default</span>
                </button>
              </div>
            </div>
          )}

          {/* Calibration History */}
          <div className="border-t border-border pt-6">
            <h5 className="font-medium text-foreground mb-3">Recent Calibrations</h5>
            <div className="space-y-2">
              {[
                { sensor: 'Soil Moisture', date: '2025-01-02 14:30', status: 'success' },
                { sensor: 'Temperature', date: '2025-01-01 09:15', status: 'success' },
                { sensor: 'Soil pH', date: '2024-12-30 16:45', status: 'warning' }
              ]?.map((calibration, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-foreground">{calibration?.sensor}</p>
                    <p className="text-xs text-muted-foreground font-caption">{calibration?.date}</p>
                  </div>
                  <Icon 
                    name={calibration?.status === 'success' ? 'CheckCircle' : 'AlertTriangle'} 
                    size={16} 
                    className={calibration?.status === 'success' ? 'text-success' : 'text-warning'}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CalibrationTools;