import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ClassroomHeader = ({ 
  classroom = {},
  onRegenerateCode,
  onShareCode,
  onExportData,
  onSettings 
}) => {
  const [isCodeVisible, setIsCodeVisible] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard?.writeText(classroom?.code);
      // You could add a toast notification here
      // Classroom code copied to clipboard
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleShareCode = () => {
    const shareData = {
      title: `Join ${classroom?.name}`,
      text: `Join my classroom "${classroom?.name}" using code: ${classroom?.code}`,
      url: `${window.location?.origin}/join-classroom?code=${classroom?.code}`
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback to copying URL
      handleCopyCode();
    }
  };

  return (
    <div className="bg-card rounded-lg border shadow-card p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Classroom Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Users" size={24} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{classroom?.name}</h1>
              <p className="text-muted-foreground font-caption">
                Created on {classroom?.createdDate} • {classroom?.studentCount} students
              </p>
            </div>
          </div>

          {/* Classroom Code Section */}
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground">Classroom Code:</span>
              <div className="flex items-center space-x-2 bg-muted px-3 py-1.5 rounded-md">
                <span className={`font-data text-lg font-bold ${isCodeVisible ? 'text-foreground' : 'text-transparent bg-muted-foreground rounded'}`}>
                  {isCodeVisible ? classroom?.code : '••••••'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName={isCodeVisible ? 'EyeOff' : 'Eye'}
                  onClick={() => setIsCodeVisible(!isCodeVisible)}
                  title={isCodeVisible ? 'Hide code' : 'Show code'}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Copy"
                onClick={handleCopyCode}
                title="Copy classroom code"
              >
                Copy
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                iconName="Share"
                onClick={handleShareCode}
                title="Share classroom"
              >
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            variant="outline"
            iconName="RefreshCw"
            onClick={onRegenerateCode}
            title="Generate new classroom code"
          >
            New Code
          </Button>
          
          <Button
            variant="outline"
            iconName="Download"
            onClick={onExportData}
            title="Export classroom data"
          >
            Export
          </Button>
          
          <Button
            variant="outline"
            iconName="Settings"
            onClick={onSettings}
            title="Classroom settings"
          >
            Settings
          </Button>
        </div>
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary font-data">{classroom?.studentCount || 0}</div>
          <div className="text-sm text-muted-foreground font-caption">Total Students</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-success font-data">{classroom?.activeToday || 0}</div>
          <div className="text-sm text-muted-foreground font-caption">Active Today</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary font-data">{classroom?.avgLevel || 0}</div>
          <div className="text-sm text-muted-foreground font-caption">Avg Level</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-accent font-data">{classroom?.completionRate || 0}%</div>
          <div className="text-sm text-muted-foreground font-caption">Task Completion</div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomHeader;