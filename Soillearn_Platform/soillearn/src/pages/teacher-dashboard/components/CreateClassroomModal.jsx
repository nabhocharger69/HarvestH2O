import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CreateClassroomModal = ({ isOpen, onClose, onCreateClassroom }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    gradeLevel: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  const generateClassroomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars?.charAt(Math.floor(Math.random() * chars?.length));
    }
    return result;
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsCreating(true);

    try {
      const newClassroom = {
        id: Date.now(),
        ...formData,
        code: generateClassroomCode(),
        studentCount: 0,
        createdAt: new Date(),
        activityLevel: 'low',
        avgEngagement: 0,
        completionRate: 0,
        avgScore: 0,
        recentActivities: []
      };

      await onCreateClassroom(newClassroom);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        subject: '',
        gradeLevel: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating classroom:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setFormData({
        title: '',
        description: '',
        subject: '',
        gradeLevel: ''
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1300 p-4">
      <div className="bg-card rounded-lg shadow-modal w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Create New Classroom</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isCreating}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Classroom Title"
            name="title"
            type="text"
            placeholder="e.g., Biology - Plant Growth Study"
            value={formData?.title}
            onChange={handleInputChange}
            required
            disabled={isCreating}
          />

          <Input
            label="Description"
            name="description"
            type="text"
            placeholder="Brief description of the classroom"
            value={formData?.description}
            onChange={handleInputChange}
            disabled={isCreating}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Subject"
              name="subject"
              type="text"
              placeholder="e.g., Biology"
              value={formData?.subject}
              onChange={handleInputChange}
              disabled={isCreating}
            />

            <Input
              label="Grade Level"
              name="gradeLevel"
              type="text"
              placeholder="e.g., 9th Grade"
              value={formData?.gradeLevel}
              onChange={handleInputChange}
              disabled={isCreating}
            />
          </div>

          {/* Info Box */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-primary mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Classroom Code</p>
                <p>A unique 6-character code will be automatically generated for students to join your classroom.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isCreating}
              iconName="Plus"
              iconPosition="left"
            >
              Create Classroom
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClassroomModal;