import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ConnectionLogs = ({ logs = [] }) => {
  const [filter, setFilter] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock connection logs
  const mockLogs = logs?.length > 0 ? logs : [
    {
      id: 1,
      timestamp: new Date('2025-01-02T14:30:25'),
      type: 'connection',
      status: 'success',
      message: 'Device ESP32_001 connected successfully',
      details: 'MAC: 24:6F:28:AB:CD:EF, Signal: 85%, Firmware: v2.1.0'
    },
    {
      id: 2,
      timestamp: new Date('2025-01-02T14:28:15'),
      type: 'pairing',
      status: 'success',
      message: 'Pairing process completed',
      details: 'Device authenticated and configured for data transmission'
    },
    {
      id: 3,
      timestamp: new Date('2025-01-02T14:25:10'),
      type: 'discovery',
      status: 'info',
      message: 'Device discovery started',
      details: 'Scanning for ESP32 devices in range...'
    },
    {
      id: 4,
      timestamp: new Date('2025-01-02T12:15:30'),
      type: 'data',
      status: 'warning',
      message: 'Data transmission interrupted',
      details: 'Connection lost for 30 seconds, attempting reconnection'
    },
    {
      id: 5,
      timestamp: new Date('2025-01-02T11:45:20'),
      type: 'calibration',
      status: 'success',
      message: 'Soil moisture sensor calibrated',
      details: 'Calibration completed with dry: 0%, wet: 100%'
    },
    {
      id: 6,
      timestamp: new Date('2025-01-02T09:30:45'),
      type: 'error',
      status: 'error',
      message: 'Connection failed',
      details: 'Unable to establish connection with ESP32_002, device not responding'
    }
  ];

  const getLogIcon = (type) => {
    switch (type) {
      case 'connection':
        return 'Wifi';
      case 'pairing':
        return 'Link';
      case 'discovery':
        return 'Search';
      case 'data':
        return 'Database';
      case 'calibration':
        return 'Settings';
      case 'error':
        return 'AlertCircle';
      default:
        return 'Info';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      case 'info':
        return 'text-secondary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'success':
        return 'bg-success/10 border-success/20';
      case 'warning':
        return 'bg-warning/10 border-warning/20';
      case 'error':
        return 'bg-error/10 border-error/20';
      case 'info':
        return 'bg-secondary/10 border-secondary/20';
      default:
        return 'bg-muted/50 border-border';
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const filteredLogs = filter === 'all' 
    ? mockLogs 
    : mockLogs?.filter(log => log?.status === filter);

  const displayedLogs = isExpanded ? filteredLogs : filteredLogs?.slice(0, 5);

  const filterOptions = [
    { value: 'all', label: 'All Logs', count: mockLogs?.length },
    { value: 'success', label: 'Success', count: mockLogs?.filter(l => l?.status === 'success')?.length },
    { value: 'warning', label: 'Warnings', count: mockLogs?.filter(l => l?.status === 'warning')?.length },
    { value: 'error', label: 'Errors', count: mockLogs?.filter(l => l?.status === 'error')?.length }
  ];

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-muted/50 rounded-lg">
            <Icon name="FileText" size={24} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Connection Logs</h3>
            <p className="text-sm text-muted-foreground font-caption">
              Device activity and troubleshooting history
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1 px-3 py-1.5 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors focus-ring text-sm"
        >
          <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
          <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
        </button>
      </div>
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions?.map((option) => (
          <button
            key={option?.value}
            onClick={() => setFilter(option?.value)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-colors focus-ring ${
              filter === option?.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <span>{option?.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-xs font-data ${
              filter === option?.value
                ? 'bg-primary-foreground/20'
                : 'bg-foreground/10'
            }`}>
              {option?.count}
            </span>
          </button>
        ))}
      </div>
      {/* Logs List */}
      {filteredLogs?.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No logs found</p>
          <p className="text-sm text-muted-foreground font-caption mt-1">
            Connection activity will appear here
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {displayedLogs?.map((log) => (
              <div
                key={log?.id}
                className={`p-4 rounded-lg border ${getStatusBg(log?.status)}`}
              >
                <div className="flex items-start space-x-3">
                  {/* Log Icon */}
                  <div className={`flex-shrink-0 ${getStatusColor(log?.status)}`}>
                    <Icon name={getLogIcon(log?.type)} size={18} />
                  </div>

                  {/* Log Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-foreground">{log?.message}</p>
                      <span className="text-xs text-muted-foreground font-data">
                        {formatTimestamp(log?.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{log?.details}</p>
                    
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium font-caption ${
                        log?.status === 'success' ? 'bg-success/20 text-success' :
                        log?.status === 'warning' ? 'bg-warning/20 text-warning' :
                        log?.status === 'error'? 'bg-error/20 text-error' : 'bg-secondary/20 text-secondary'
                      }`}>
                        {log?.type?.charAt(0)?.toUpperCase() + log?.type?.slice(1)}
                      </span>
                      
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium font-caption ${
                        log?.status === 'success' ? 'bg-success/20 text-success' :
                        log?.status === 'warning' ? 'bg-warning/20 text-warning' :
                        log?.status === 'error'? 'bg-error/20 text-error' : 'bg-secondary/20 text-secondary'
                      }`}>
                        {log?.status?.charAt(0)?.toUpperCase() + log?.status?.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More/Less Button */}
          {filteredLogs?.length > 5 && (
            <div className="text-center mt-4">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center space-x-2 mx-auto px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors focus-ring"
              >
                <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
                <span>
                  {isExpanded 
                    ? 'Show Less' 
                    : `Show ${filteredLogs?.length - 5} More Logs`
                  }
                </span>
              </button>
            </div>
          )}
        </>
      )}
      {/* Log Actions */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span className="font-caption">
            Last updated: {formatTimestamp(new Date())}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-1 px-3 py-1.5 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors focus-ring text-sm">
            <Icon name="Download" size={14} />
            <span>Export</span>
          </button>
          
          <button className="flex items-center space-x-1 px-3 py-1.5 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors focus-ring text-sm">
            <Icon name="Trash2" size={14} />
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionLogs;