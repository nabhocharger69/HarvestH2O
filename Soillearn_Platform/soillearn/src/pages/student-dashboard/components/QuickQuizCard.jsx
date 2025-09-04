import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickQuizCard = () => {
  const navigate = useNavigate();
  const [quizStatus, setQuizStatus] = useState({
    available: true,
    questionsTotal: 10,
    questionsCompleted: 0,
    currentStreak: 5,
    bestScore: 85,
    todayAttempted: false
  });

  const quizStats = [
    {
      label: "Today\'s Questions",
      value: `${quizStatus?.questionsCompleted}/${quizStatus?.questionsTotal}`,
      icon: "HelpCircle",
      color: "text-primary"
    },
    {
      label: "Current Streak",
      value: `${quizStatus?.currentStreak} days`,
      icon: "Flame",
      color: "text-accent"
    },
    {
      label: "Best Score",
      value: `${quizStatus?.bestScore}%`,
      icon: "Trophy",
      color: "text-success"
    }
  ];

  const recentTopics = [
    "Plant Photosynthesis",
    "Soil pH Levels",
    "Nutrient Absorption",
    "Root Development",
    "Water Cycle"
  ];

  const handleStartQuiz = () => {
    navigate('/daily-quiz');
  };

  const getQuizStatusMessage = () => {
    if (quizStatus?.todayAttempted) {
      return {
        message: "Quiz completed for today!",
        subMessage: "Come back tomorrow for new questions",
        icon: "CheckCircle",
        color: "text-success"
      };
    }
    
    if (quizStatus?.available) {
      return {
        message: "Daily quiz is ready!",
        subMessage: "10 questions about plant biology await",
        icon: "Brain",
        color: "text-primary"
      };
    }

    return {
      message: "Quiz not available",
      subMessage: "Check back later",
      icon: "Clock",
      color: "text-muted-foreground"
    };
  };

  const statusInfo = getQuizStatusMessage();

  return (
    <div className="card-elevated p-6 bg-gradient-to-br from-secondary/5 to-primary/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Daily Quiz</h2>
          <p className="text-sm text-muted-foreground font-caption">
            Test your knowledge and earn XP
          </p>
        </div>
        
        {/* Quiz Status Icon */}
        <div className={`p-3 rounded-full bg-primary/10`}>
          <Icon 
            name={statusInfo?.icon} 
            size={24} 
            className={statusInfo?.color}
          />
        </div>
      </div>
      {/* Status Message */}
      <div className="mb-6 p-4 bg-card rounded-lg border">
        <div className="flex items-center space-x-3">
          <Icon 
            name={statusInfo?.icon} 
            size={20} 
            className={statusInfo?.color}
          />
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {statusInfo?.message}
            </h3>
            <p className="text-xs text-muted-foreground font-caption">
              {statusInfo?.subMessage}
            </p>
          </div>
        </div>
      </div>
      {/* Quiz Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {quizStats?.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="flex justify-center mb-2">
              <Icon 
                name={stat?.icon} 
                size={18} 
                className={stat?.color}
              />
            </div>
            <div className="text-sm font-bold font-data text-foreground">
              {stat?.value}
            </div>
            <div className="text-xs text-muted-foreground font-caption">
              {stat?.label}
            </div>
          </div>
        ))}
      </div>
      {/* XP Rewards Info */}
      <div className="mb-6 p-3 bg-accent/10 rounded-lg border border-accent/20">
        <h3 className="text-sm font-semibold text-foreground mb-2">
          XP Rewards
        </h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Icon name="Plus" size={12} className="text-success" />
            <span className="text-muted-foreground font-caption">
              +5 XP per correct answer
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Minus" size={12} className="text-error" />
            <span className="text-muted-foreground font-caption">
              -2 XP per wrong answer
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Star" size={12} className="text-accent" />
            <span className="text-muted-foreground font-caption">
              +10 XP bonus for 100%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Flame" size={12} className="text-accent" />
            <span className="text-muted-foreground font-caption">
              +5 XP streak bonus
            </span>
          </div>
        </div>
      </div>
      {/* Recent Topics */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Recent Topics
        </h3>
        <div className="flex flex-wrap gap-2">
          {recentTopics?.map((topic, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md font-caption"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
      {/* Action Button */}
      <div className="flex justify-center">
        <Button
          variant={quizStatus?.todayAttempted ? "outline" : "default"}
          onClick={handleStartQuiz}
          disabled={!quizStatus?.available}
          className="w-full sm:w-auto"
          iconName={quizStatus?.todayAttempted ? "RotateCcw" : "Play"}
          iconPosition="left"
        >
          {quizStatus?.todayAttempted ? "Review Answers" : "Start Daily Quiz"}
        </Button>
      </div>
      {/* Time Until Reset */}
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground font-caption">
          New quiz available in 18h 32m
        </p>
      </div>
    </div>
  );
};

export default QuickQuizCard;