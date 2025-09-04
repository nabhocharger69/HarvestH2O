import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ConnectionInstructions = ({ onStartPairing }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Power On Device",
      description: "Connect your ESP32 device to power source and wait for the LED indicator to start blinking blue.",
      icon: "Power",
      duration: "~30 seconds"
    },
    {
      title: "Enable Pairing Mode",
      description: "Press and hold the pairing button on your ESP32 device for 3 seconds until LED turns green.",
      icon: "Bluetooth",
      duration: "~5 seconds"
    },
    {
      title: "Start Discovery",
      description: "Click the \'Start Pairing\' button below to begin searching for your device.",
      icon: "Search",
      duration: "~10 seconds"
    },
    {
      title: "Complete Setup",
      description: "Select your device from the list and follow the on-screen prompts to complete pairing.",
      icon: "CheckCircle",
      duration: "~15 seconds"
    }
  ];

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const handleStartPairing = () => {
    onStartPairing();
    setCurrentStep(2); // Move to discovery step
  };

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-accent/10 rounded-lg">
          <Icon name="BookOpen" size={24} className="text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Connection Guide</h3>
          <p className="text-sm text-muted-foreground font-caption">Step-by-step pairing instructions</p>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Setup Progress</span>
          <span className="text-sm text-muted-foreground font-caption">
            Step {currentStep + 1} of {steps?.length}
          </span>
        </div>
        <div className="progress-bar h-2">
          <div 
            className="progress-fill"
            style={{ width: `${((currentStep + 1) / steps?.length) * 100}%` }}
          />
        </div>
      </div>
      {/* Steps List */}
      <div className="space-y-4 mb-6">
        {steps?.map((step, index) => (
          <div
            key={index}
            onClick={() => handleStepClick(index)}
            className={`flex items-start space-x-4 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
              index === currentStep
                ? 'bg-primary/10 border border-primary/20'
                : index < currentStep
                ? 'bg-success/10 border border-success/20' :'bg-muted/50 border border-transparent hover:bg-muted/70'
            }`}
          >
            {/* Step Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              index === currentStep
                ? 'bg-primary text-primary-foreground'
                : index < currentStep
                ? 'bg-success text-success-foreground'
                : 'bg-muted text-muted-foreground'
            }`}>
              {index < currentStep ? (
                <Icon name="Check" size={20} />
              ) : (
                <Icon name={step?.icon} size={20} />
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className={`font-medium ${
                  index === currentStep ? 'text-primary' : 
                  index < currentStep ? 'text-success' : 'text-foreground'
                }`}>
                  {step?.title}
                </h4>
                <span className="text-xs text-muted-foreground font-caption">
                  {step?.duration}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {step?.description}
              </p>
            </div>

            {/* Step Number */}
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-data ${
              index === currentStep
                ? 'bg-primary/20 text-primary'
                : index < currentStep
                ? 'bg-success/20 text-success' :'bg-muted text-muted-foreground'
            }`}>
              {index + 1}
            </div>
          </div>
        ))}
      </div>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleStartPairing}
          className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors focus-ring"
        >
          <Icon name="Play" size={16} />
          <span className="font-medium">Start Pairing Process</span>
        </button>

        <button
          onClick={() => setCurrentStep(0)}
          className="flex items-center space-x-2 px-4 py-3 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors focus-ring"
        >
          <Icon name="RotateCcw" size={16} />
          <span className="font-medium">Reset Steps</span>
        </button>
      </div>
      {/* Troubleshooting Tip */}
      <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={20} className="text-warning flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-medium text-warning mb-1">Troubleshooting Tip</h5>
            <p className="text-sm text-muted-foreground">
              If your device doesn't appear in the discovery list, try moving closer to your ESP32 device and ensure it's in pairing mode (green LED).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionInstructions;