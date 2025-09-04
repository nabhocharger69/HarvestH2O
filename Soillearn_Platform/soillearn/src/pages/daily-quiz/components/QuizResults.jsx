import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuizResults = ({
  score,
  totalQuestions,
  xpGained,
  xpLost,
  correctAnswers,
  incorrectAnswers,
  timeSpent,
  onReturnToDashboard,
  onReviewAnswers,
  onRetakeQuiz
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const percentage = Math.round((score / totalQuestions) * 100);
  const netXP = xpGained - xpLost;

  useEffect(() => {
    if (percentage >= 80) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [percentage]);

  const getPerformanceMessage = () => {
    if (percentage >= 90) return "Outstanding! You're a soil science expert! 🌟";
    if (percentage >= 80) return "Excellent work! You really know your stuff! 🎉";
    if (percentage >= 70) return "Good job! You're making great progress! 👍";
    if (percentage >= 60) return "Not bad! Keep studying to improve! 📚";
    return "Don't give up! Review the material and try again! 💪";
  };

  const getPerformanceColor = () => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-error';
  };

  const getGradeIcon = () => {
    if (percentage >= 90) return 'Trophy';
    if (percentage >= 80) return 'Award';
    if (percentage >= 70) return 'Star';
    if (percentage >= 60) return 'ThumbsUp';
    return 'BookOpen';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce-subtle">
            <div className="text-6xl">🎉</div>
          </div>
        </div>
      )}
      {/* Results Header */}
      <div className="bg-card rounded-lg border shadow-card p-8 text-center">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
          percentage >= 80 ? 'bg-success/10' : percentage >= 60 ? 'bg-warning/10' : 'bg-error/10'
        }`}>
          <Icon 
            name={getGradeIcon()} 
            size={40} 
            className={getPerformanceColor()}
          />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">
          Quiz Complete!
        </h1>
        
        <p className={`text-lg font-medium mb-4 ${getPerformanceColor()}`}>
          {getPerformanceMessage()}
        </p>

        {/* Score Display */}
        <div className="flex items-center justify-center space-x-8 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground">
              {score}/{totalQuestions}
            </div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </div>
          
          <div className="w-px h-12 bg-border"></div>
          
          <div className="text-center">
            <div className={`text-4xl font-bold ${getPerformanceColor()}`}>
              {percentage}%
            </div>
            <div className="text-sm text-muted-foreground">Score</div>
          </div>
        </div>

        {/* XP Summary */}
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
          netXP > 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
        }`}>
          <Icon name={netXP > 0 ? 'TrendingUp' : 'TrendingDown'} size={20} />
          <span className="font-bold">
            {netXP > 0 ? '+' : ''}{netXP} XP
          </span>
        </div>
      </div>
      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border shadow-card p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-success/10 p-2 rounded-lg">
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
          </div>
          <div className="text-xs text-success font-medium">
            +{xpGained} XP earned
          </div>
        </div>

        <div className="bg-card rounded-lg border shadow-card p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-error/10 p-2 rounded-lg">
              <Icon name="XCircle" size={20} className="text-error" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{incorrectAnswers}</div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
          </div>
          <div className="text-xs text-error font-medium">
            -{xpLost} XP lost
          </div>
        </div>

        <div className="bg-card rounded-lg border shadow-card p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Icon name="Clock" size={20} className="text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{formatTime(timeSpent)}</div>
              <div className="text-sm text-muted-foreground">Time Spent</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Avg: {Math.round(timeSpent / totalQuestions)}s per question
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="default"
          onClick={onReturnToDashboard}
          iconName="Home"
          iconPosition="left"
          className="sm:w-auto"
        >
          Return to Dashboard
        </Button>

        {incorrectAnswers > 0 && (
          <Button
            variant="outline"
            onClick={onReviewAnswers}
            iconName="Eye"
            iconPosition="left"
            className="sm:w-auto"
          >
            Review Incorrect Answers
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={onRetakeQuiz}
          iconName="RotateCcw"
          iconPosition="left"
          className="sm:w-auto"
        >
          Retake Quiz
        </Button>
      </div>
      {/* Daily Progress Note */}
      <div className="bg-muted/50 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Calendar" size={16} />
          <span>Daily quiz completed for {new Date()?.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;