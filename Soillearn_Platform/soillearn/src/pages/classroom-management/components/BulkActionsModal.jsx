import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BulkActionsModal = ({ 
  isOpen, 
  onClose, 
  actionType, 
  selectedStudents = [], 
  onConfirm 
}) => {
  const [message, setMessage] = useState('');
  const [taskType, setTaskType] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [exportFormat, setExportFormat] = useState('csv');

  const taskTypeOptions = [
    { value: 'quiz', label: 'Daily Quiz' },
    { value: 'photo', label: 'Plant Photo Upload' },
    { value: 'observation', label: 'Growth Observation' },
    { value: 'research', label: 'Research Task' }
  ];

  const exportFormatOptions = [
    { value: 'csv', label: 'CSV File' },
    { value: 'pdf', label: 'PDF Report' },
    { value: 'json', label: 'JSON Data' }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    const actionData = {
      type: actionType,
      studentIds: selectedStudents,
      ...(actionType === 'message' && { message }),
      ...(actionType === 'task' && { taskType, dueDate, message }),
      ...(actionType === 'export' && { format: exportFormat })
    };

    onConfirm(actionData);
    handleClose();
  };

  const handleClose = () => {
    setMessage('');
    setTaskType('');
    setDueDate('');
    setExportFormat('csv');
    onClose();
  };

  if (!isOpen) return null;

  const getModalTitle = () => {
    switch (actionType) {
      case 'message':
        return 'Send Message to Students';
      case 'task':
        return 'Assign Task to Students';
      case 'export':
        return 'Export Student Data';
      default:
        return 'Bulk Action';
    }
  };

  const getModalIcon = () => {
    switch (actionType) {
      case 'message':
        return 'MessageSquare';
      case 'task':
        return 'ClipboardList';
      case 'export':
        return 'Download';
      default:
        return 'Users';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1300 p-4">
      <div className="bg-card rounded-lg border shadow-modal w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name={getModalIcon()} size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{getModalTitle()}</h2>
              <p className="text-sm text-muted-foreground font-caption">
                {selectedStudents?.length} student{selectedStudents?.length > 1 ? 's' : ''} selected
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="focus-ring"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {actionType === 'message' && (
            <Input
              label="Message"
              type="text"
              placeholder="Enter your message to students..."
              value={message}
              onChange={(e) => setMessage(e?.target?.value)}
              required
              description="This message will be sent to all selected students"
            />
          )}

          {actionType === 'task' && (
            <>
              <Select
                label="Task Type"
                options={taskTypeOptions}
                value={taskType}
                onChange={setTaskType}
                placeholder="Select task type"
                required
              />
              
              <Input
                label="Due Date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e?.target?.value)}
                required
                description="When should this task be completed?"
              />
              
              <Input
                label="Instructions"
                type="text"
                placeholder="Additional instructions for the task..."
                value={message}
                onChange={(e) => setMessage(e?.target?.value)}
                description="Optional instructions or notes"
              />
            </>
          )}

          {actionType === 'export' && (
            <Select
              label="Export Format"
              options={exportFormatOptions}
              value={exportFormat}
              onChange={setExportFormat}
              description="Choose the format for your export file"
            />
          )}

          {/* Selected Students Preview */}
          <div className="bg-muted/30 rounded-md p-3">
            <p className="text-sm font-medium text-foreground mb-2">Selected Students:</p>
            <div className="flex flex-wrap gap-2">
              {selectedStudents?.slice(0, 5)?.map((studentId, index) => (
                <span key={studentId} className="achievement-badge bg-primary/10 text-primary">
                  Student {index + 1}
                </span>
              ))}
              {selectedStudents?.length > 5 && (
                <span className="achievement-badge bg-muted text-muted-foreground">
                  +{selectedStudents?.length - 5} more
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              iconName={getModalIcon()}
            >
              {actionType === 'message' ? 'Send Message' :
               actionType === 'task' ? 'Assign Task' :
               actionType === 'export' ? 'Export Data' : 'Confirm'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkActionsModal;