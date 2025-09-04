import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DailyTaskCard = ({ onTaskComplete }) => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Check Soil Moisture",
      description: "Monitor your plant\'s soil moisture levels",
      xpReward: 10,
      completed: true,
      type: "sensor",
      icon: "Droplets",
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      title: "Check All Plants Photo",
      description: "View all uploaded plant growth photos",
      xpReward: 10,
      completed: false,
      type: "photo_gallery",
      icon: "Images",
      deadline: new Date(Date.now() + 6 * 60 * 60 * 1000)
    },
    {
      id: 3,
      title: "Complete Daily Quiz",
      description: "Answer 10 questions about plant biology",
      xpReward: 10,
      completed: false,
      type: "quiz",
      icon: "Brain",
      deadline: new Date(Date.now() + 8 * 60 * 60 * 1000)
    },
    {
      id: 4,
      title: "Review Sensor Data",
      description: "Analyze yesterday\'s environmental readings",
      xpReward: 5,
      completed: false,
      type: "analysis",
      icon: "BarChart3",
      deadline: new Date(Date.now() + 4 * 60 * 60 * 1000)
    }
  ]);

  const completedTasks = tasks?.filter(task => task?.completed)?.length;
  const totalTasks = tasks?.length;
  const totalXPAvailable = tasks?.reduce((sum, task) => sum + task?.xpReward, 0);
  const earnedXP = tasks?.filter(task => task?.completed)?.reduce((sum, task) => sum + task?.xpReward, 0);

  const handleTaskAction = (taskId, taskType) => {
    if (taskType === 'photo_gallery') {
      // Navigate to photo gallery
      window.location.href = '/photo-gallery';
    } else if (taskType === 'quiz') {
      // Navigate to daily quiz
      window.location.href = '/daily-quiz';
    } else if (taskType === 'sensor') {
      // Navigate to device connection
      window.location.href = '/device-connection';
    } else if (taskType === 'analysis') {
      // Navigate to sensor data analysis
      window.location.href = '/sensor-analysis';
    }
  };

  const formatTimeRemaining = (deadline) => {
    const now = new Date();
    const diff = deadline - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    }
    return `${minutes}m left`;
  };

  const getTaskStatusColor = (task) => {
    if (task?.completed) return 'text-success';
    if (task?.deadline && task?.deadline < new Date()) return 'text-error';
    return 'text-warning';
  };

  const getTaskBorderColor = (task) => {
    if (task?.completed) return 'border-success/20 bg-success/5';
    if (task?.deadline && task?.deadline < new Date()) return 'border-error/20 bg-error/5';
    return 'border-warning/20 bg-warning/5';
  };

  return (
    <div className="card-elevated p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Daily Tasks</h2>
          <p className="text-sm text-muted-foreground font-caption">
            Complete tasks to earn XP and maintain your streak
          </p>
        </div>
        
        {/* Progress Summary */}
        <div className="text-right">
          <div className="text-lg font-bold font-data text-foreground">
            {completedTasks}/{totalTasks}
          </div>
          <p className="text-xs text-muted-foreground font-caption">
            {earnedXP}/{totalXPAvailable} XP
          </p>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="progress-bar h-2">
          <div 
            className="progress-fill"
            style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground font-caption">
            Progress: {Math.round((completedTasks / totalTasks) * 100)}%
          </span>
          <span className="text-xs text-muted-foreground font-caption">
            {totalTasks - completedTasks} tasks remaining
          </span>
        </div>
      </div>
      {/* Task List */}
      <div className="space-y-3">
        {tasks?.map((task) => (
          <div
            key={task?.id}
            className={`p-4 rounded-lg border transition-all ${getTaskBorderColor(task)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                {/* Task Icon */}
                <div className={`p-2 rounded-lg ${
                  task?.completed ? 'bg-success/10' : 'bg-muted'
                }`}>
                  <Icon 
                    name={task?.completed ? 'CheckCircle' : task?.icon} 
                    size={18} 
                    className={task?.completed ? 'text-success' : 'text-muted-foreground'}
                  />
                </div>

                {/* Task Details */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-medium ${
                    task?.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                  }`}>
                    {task?.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-caption mt-1">
                    {task?.description}
                  </p>
                  
                  {/* Time Info */}
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Icon name="Zap" size={12} className="text-accent" />
                      <span className="text-xs font-medium font-data text-accent">
                        +{task?.xpReward} XP
                      </span>
                    </div>
                    
                    {task?.completed ? (
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={12} className="text-success" />
                        <span className="text-xs text-success font-caption">
                          Completed {formatTimeRemaining(task?.completedAt)} ago
                        </span>
                      </div>
                    ) : task?.deadline && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={12} className={getTaskStatusColor(task)} />
                        <span className={`text-xs font-caption ${getTaskStatusColor(task)}`}>
                          {formatTimeRemaining(task?.deadline)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {!task?.completed && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTaskAction(task?.id, task?.type)}
                  className="ml-4"
                >
                  Start
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Completion Bonus */}
      {completedTasks === totalTasks && (
        <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon name="Star" size={20} className="text-accent" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                All Tasks Complete! 🎉
              </h3>
              <p className="text-xs text-muted-foreground font-caption">
                Bonus +5 XP for completing all daily tasks
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyTaskCard;