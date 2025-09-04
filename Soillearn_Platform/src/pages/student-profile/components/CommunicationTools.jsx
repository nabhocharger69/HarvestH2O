import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CommunicationTools = ({ studentName, onSendFeedback, onScheduleMeeting, onSendCelebration }) => {
  const [activeTab, setActiveTab] = useState('feedback');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('positive');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');
  const [celebrationType, setCelebrationType] = useState('achievement');
  const [celebrationMessage, setCelebrationMessage] = useState('');

  const tabs = [
    { id: 'feedback', label: 'Send Feedback', icon: 'MessageSquare' },
    { id: 'meeting', label: 'Schedule Meeting', icon: 'Calendar' },
    { id: 'celebration', label: 'Celebrate Progress', icon: 'Award' }
  ];

  const feedbackTypes = [
    { value: 'positive', label: 'Positive Feedback', icon: 'ThumbsUp', color: 'text-success' },
    { value: 'constructive', label: 'Constructive Feedback', icon: 'MessageCircle', color: 'text-warning' },
    { value: 'concern', label: 'Area of Concern', icon: 'AlertTriangle', color: 'text-error' }
  ];

  const celebrationTypes = [
    { value: 'achievement', label: 'Achievement Unlocked', icon: 'Award', color: 'text-accent' },
    { value: 'improvement', label: 'Great Improvement', icon: 'TrendingUp', color: 'text-success' },
    { value: 'milestone', label: 'Milestone Reached', icon: 'Target', color: 'text-primary' },
    { value: 'streak', label: 'Streak Celebration', icon: 'Zap', color: 'text-secondary' }
  ];

  const feedbackTemplates = {
    positive: [
      `Great work on your recent quiz performance, ${studentName}! Your dedication is showing.`,
      `${studentName}, your plant care consistency has been excellent this week.`,
      `Outstanding progress in understanding soil health concepts, ${studentName}!`
    ],
    constructive: [
      `${studentName}, let's work together to improve your daily task completion rate.`,
      `Consider reviewing the plant growth stages material, ${studentName}. I'm here to help!`,
      `${studentName}, your quiz scores show potential - let's focus on the areas we discussed.`
    ],
    concern: [
      `${studentName}, I've noticed some missed assignments. Let's discuss how I can support you.`,
      `${studentName}, your recent engagement has decreased. Is everything okay?`,
      `Let's schedule a check-in, ${studentName}. I want to ensure you're getting the support you need.`
    ]
  };

  const handleSendFeedback = () => {
    if (feedbackMessage?.trim()) {
      const feedback = {
        type: feedbackType,
        message: feedbackMessage,
        timestamp: new Date()?.toISOString(),
        studentName
      };
      
      if (onSendFeedback) {
        onSendFeedback(feedback);
      }
      
      setFeedbackMessage('');
      // Show success message or notification
    }
  };

  const handleScheduleMeeting = () => {
    if (meetingDate && meetingTime) {
      const meeting = {
        date: meetingDate,
        time: meetingTime,
        notes: meetingNotes,
        studentName,
        timestamp: new Date()?.toISOString()
      };
      
      if (onScheduleMeeting) {
        onScheduleMeeting(meeting);
      }
      
      setMeetingDate('');
      setMeetingTime('');
      setMeetingNotes('');
      // Show success message
    }
  };

  const handleSendCelebration = () => {
    if (celebrationMessage?.trim()) {
      const celebration = {
        type: celebrationType,
        message: celebrationMessage,
        timestamp: new Date()?.toISOString(),
        studentName
      };
      
      if (onSendCelebration) {
        onSendCelebration(celebration);
      }
      
      setCelebrationMessage('');
      // Show success message
    }
  };

  const useTemplate = (template) => {
    setFeedbackMessage(template);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-foreground">Communication Tools</h2>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="User" size={16} />
          <span>Communicating with {studentName}</span>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="flex bg-muted rounded-md p-1 mb-6">
        {tabs?.map((tab) => (
          <Button
            key={tab?.id}
            variant={activeTab === tab?.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab?.id)}
            iconName={tab?.icon}
            iconSize={14}
            className="flex-1 text-xs"
          >
            {tab?.label}
          </Button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'feedback' && (
          <div className="space-y-4">
            {/* Feedback Type Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Feedback Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {feedbackTypes?.map((type) => (
                  <button
                    key={type?.value}
                    onClick={() => setFeedbackType(type?.value)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      feedbackType === type?.value
                        ? 'border-primary bg-primary/10' :'border-border hover:border-muted-foreground/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name={type?.icon} size={16} className={type?.color} />
                      <span className="text-sm font-medium text-foreground">{type?.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Templates */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Quick Templates</label>
              <div className="space-y-2">
                {feedbackTemplates?.[feedbackType]?.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => useTemplate(template)}
                    className="w-full p-3 text-left bg-muted hover:bg-muted/80 rounded-lg border border-border transition-colors"
                  >
                    <p className="text-sm text-foreground">{template}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Message */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Custom Message</label>
              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e?.target?.value)}
                className="w-full p-3 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                rows={4}
                placeholder="Write your personalized feedback message..."
              />
            </div>

            <Button
              variant="default"
              onClick={handleSendFeedback}
              iconName="Send"
              iconSize={16}
              disabled={!feedbackMessage?.trim()}
              className="w-full sm:w-auto"
            >
              Send Feedback
            </Button>
          </div>
        )}

        {activeTab === 'meeting' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Meeting Date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e?.target?.value)}
                required
              />
              
              <Input
                type="time"
                label="Meeting Time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e?.target?.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Meeting Notes (Optional)</label>
              <textarea
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e?.target?.value)}
                className="w-full p-3 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
                placeholder="Add any specific topics or concerns to discuss..."
              />
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Info" size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Meeting Information</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Meeting invitations will be sent to student and parents</li>
                <li>• Virtual meeting link will be provided automatically</li>
                <li>• Reminder notifications sent 24 hours and 1 hour before</li>
              </ul>
            </div>

            <Button
              variant="default"
              onClick={handleScheduleMeeting}
              iconName="Calendar"
              iconSize={16}
              disabled={!meetingDate || !meetingTime}
              className="w-full sm:w-auto"
            >
              Schedule Meeting
            </Button>
          </div>
        )}

        {activeTab === 'celebration' && (
          <div className="space-y-4">
            {/* Celebration Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Celebration Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {celebrationTypes?.map((type) => (
                  <button
                    key={type?.value}
                    onClick={() => setCelebrationType(type?.value)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      celebrationType === type?.value
                        ? 'border-primary bg-primary/10' :'border-border hover:border-muted-foreground/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon name={type?.icon} size={16} className={type?.color} />
                      <span className="text-sm font-medium text-foreground">{type?.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Celebration Message */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Celebration Message</label>
              <textarea
                value={celebrationMessage}
                onChange={(e) => setCelebrationMessage(e?.target?.value)}
                className="w-full p-3 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
                placeholder={`Congratulate ${studentName} on their achievement...`}
              />
            </div>

            {/* Preview */}
            {celebrationMessage && (
              <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Eye" size={16} className="text-success" />
                  <span className="text-sm font-medium text-success">Preview</span>
                </div>
                <div className="p-3 bg-card rounded-md border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon 
                      name={celebrationTypes?.find(t => t?.value === celebrationType)?.icon} 
                      size={16} 
                      className={celebrationTypes?.find(t => t?.value === celebrationType)?.color} 
                    />
                    <span className="text-sm font-medium text-foreground">
                      {celebrationTypes?.find(t => t?.value === celebrationType)?.label}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{celebrationMessage}</p>
                </div>
              </div>
            )}

            <Button
              variant="success"
              onClick={handleSendCelebration}
              iconName="Send"
              iconSize={16}
              disabled={!celebrationMessage?.trim()}
              className="w-full sm:w-auto"
            >
              Send Celebration
            </Button>
          </div>
        )}
      </div>
      {/* Recent Communications */}
      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">Recent Communications</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Icon name="MessageSquare" size={16} className="text-success" />
            <div className="flex-1">
              <p className="text-sm text-foreground">Positive feedback sent</p>
              <p className="text-xs text-muted-foreground font-caption">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Icon name="Calendar" size={16} className="text-primary" />
            <div className="flex-1">
              <p className="text-sm text-foreground">Meeting scheduled for tomorrow</p>
              <p className="text-xs text-muted-foreground font-caption">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationTools;