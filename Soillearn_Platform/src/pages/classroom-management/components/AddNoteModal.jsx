import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AddNoteModal = ({ 
  isOpen, 
  onClose, 
  student = null, 
  onSaveNote 
}) => {
  const [noteText, setNoteText] = useState('');
  const [noteType, setNoteType] = useState('general');
  const [isPrivate, setIsPrivate] = useState(false);

  const noteTypeOptions = [
    { value: 'general', label: 'General Note' },
    { value: 'academic', label: 'Academic Performance' },
    { value: 'behavior', label: 'Behavior Observation' },
    { value: 'progress', label: 'Progress Update' },
    { value: 'concern', label: 'Concern/Issue' },
    { value: 'achievement', label: 'Achievement/Success' }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    const noteData = {
      studentId: student?.id,
      text: noteText,
      type: noteType,
      isPrivate,
      timestamp: new Date()?.toISOString(),
      teacherId: 'current-teacher-id' // This would come from auth context
    };

    onSaveNote(noteData);
    handleClose();
  };

  const handleClose = () => {
    setNoteText('');
    setNoteType('general');
    setIsPrivate(false);
    onClose();
  };

  if (!isOpen || !student) return null;

  const getNoteTypeIcon = (type) => {
    switch (type) {
      case 'academic':
        return 'BookOpen';
      case 'behavior':
        return 'Users';
      case 'progress':
        return 'TrendingUp';
      case 'concern':
        return 'AlertTriangle';
      case 'achievement':
        return 'Award';
      default:
        return 'FileText';
    }
  };

  const getNoteTypeColor = (type) => {
    switch (type) {
      case 'academic':
        return 'text-primary';
      case 'behavior':
        return 'text-secondary';
      case 'progress':
        return 'text-success';
      case 'concern':
        return 'text-warning';
      case 'achievement':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1300 p-4">
      <div className="bg-card rounded-lg border shadow-modal w-full max-w-lg animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="FileText" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Add Note</h2>
              <p className="text-sm text-muted-foreground font-caption">
                For {student?.name} ({student?.rollNumber})
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
          {/* Student Info */}
          <div className="bg-muted/30 rounded-md p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="User" size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{student?.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground font-caption">
                  <span>Roll: {student?.rollNumber}</span>
                  <span>Level: {student?.level}</span>
                  <span>Plant: {student?.plantType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Note Type */}
          <Select
            label="Note Type"
            options={noteTypeOptions}
            value={noteType}
            onChange={setNoteType}
            description="Categorize your note for better organization"
          />

          {/* Note Type Preview */}
          <div className="flex items-center space-x-2 p-3 bg-muted/20 rounded-md">
            <Icon 
              name={getNoteTypeIcon(noteType)} 
              size={16} 
              className={getNoteTypeColor(noteType)} 
            />
            <span className="text-sm text-muted-foreground font-caption">
              This note will be categorized as: {noteTypeOptions?.find(opt => opt?.value === noteType)?.label}
            </span>
          </div>

          {/* Note Text */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Note Content *
            </label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e?.target?.value)}
              placeholder="Enter your note about this student..."
              required
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1 font-caption">
              {noteText?.length}/500 characters
            </p>
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center space-x-3 p-3 bg-muted/20 rounded-md">
            <input
              type="checkbox"
              id="private-note"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e?.target?.checked)}
              className="rounded border-border focus:ring-primary"
            />
            <div className="flex-1">
              <label htmlFor="private-note" className="text-sm font-medium text-foreground cursor-pointer">
                Private Note
              </label>
              <p className="text-xs text-muted-foreground font-caption">
                Only you can see this note. Uncheck to share with other teachers.
              </p>
            </div>
            <Icon 
              name={isPrivate ? 'Lock' : 'Users'} 
              size={16} 
              className={isPrivate ? 'text-warning' : 'text-muted-foreground'} 
            />
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
              iconName="Save"
              disabled={!noteText?.trim()}
            >
              Save Note
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoteModal;