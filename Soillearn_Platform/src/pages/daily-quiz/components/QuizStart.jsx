import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuizStart = ({ 
  onStartQuiz, 
  lastQuizDate, 
  lastQuizScore, 
  currentStreak,
  totalQuizzesTaken,
  averageScore 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const today = new Date()?.toDateString();
  const hasCompletedToday = lastQuizDate === today;

  const handleStartQuiz = async () => {
    setIsLoading(true);
    // Simulate loading time for quiz preparation
    setTimeout(() => {
      onStartQuiz();
      setIsLoading(false);
    }, 1500);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStreakMessage = () => {
    if (currentStreak === 0) return "Start your learning streak today!";
    if (currentStreak === 1) return "Great start! Keep it going!";
    if (currentStreak < 7) return `${currentStreak} days strong! 🔥`;
    if (currentStreak < 30) return `Amazing ${currentStreak}-day streak! 🌟`;
    return `Incredible ${currentStreak}-day streak! You're a legend! 🏆`;
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Ready to grow your knowledge? 🌱",
      "Let\'s dig into some soil science! 🌍",
      "Time to cultivate your understanding! 🌾",
      "Plant some knowledge seeds today! 🌰",
      "Your brain is ready for fertilization! 🧠"
    ];
    return messages?.[Math.floor(Math.random() * messages?.length)];
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="bg-card rounded-lg border shadow-card p-8 text-center">
        <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Brain" size={40} className="text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Daily Quiz Challenge
        </h1>
        
        <p className="text-lg text-muted-foreground mb-4">
          {getMotivationalMessage()}
        </p>

        {/* Quiz Status */}
        {hasCompletedToday ? (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-success">
              <Icon name="CheckCircle" size={20} />
              <span className="font-medium">Quiz completed today!</span>
            </div>
            <p className="text-sm text-success/80 mt-1">
              Score: {lastQuizScore}% • Come back tomorrow for a new challenge
            </p>
          </div>
        ) : (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-primary">
              <Icon name="Clock" size={20} />
              <span className="font-medium">Ready for today's challenge!</span>
            </div>
            <p className="text-sm text-primary/80 mt-1">
              10 questions • 5 minutes • Earn up to 50 XP
            </p>
          </div>
        )}

        {/* Start Quiz Button */}
        <Button
          variant={hasCompletedToday ? "outline" : "default"}
          size="lg"
          onClick={handleStartQuiz}
          loading={isLoading}
          disabled={isLoading}
          iconName={hasCompletedToday ? "RotateCcw" : "Play"}
          iconPosition="left"
          className="w-full sm:w-auto"
        >
          {hasCompletedToday ? "Retake Quiz" : "Start Daily Quiz"}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Streak Card */}
        <div className="bg-card rounded-lg border shadow-card p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-accent/10 p-2 rounded-lg">
              <Icon name="Flame" size={24} className="text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{currentStreak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {getStreakMessage()}
          </p>
        </div>

        {/* Total Quizzes */}
        <div className="bg-card rounded-lg border shadow-card p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-secondary/10 p-2 rounded-lg">
              <Icon name="BookOpen" size={24} className="text-secondary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{totalQuizzesTaken}</div>
              <div className="text-sm text-muted-foreground">Quizzes Taken</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Keep learning every day!
          </p>
        </div>

        {/* Average Score */}
        <div className="bg-card rounded-lg border shadow-card p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Icon name="TrendingUp" size={24} className="text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{averageScore}%</div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {averageScore >= 80 ? "Excellent performance!" : "Room for improvement!"}
          </p>
        </div>

        {/* Last Quiz */}
        <div className="bg-card rounded-lg border shadow-card p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-muted p-2 rounded-lg">
              <Icon name="Calendar" size={24} className="text-muted-foreground" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">{formatDate(lastQuizDate)}</div>
              <div className="text-sm text-muted-foreground">Last Quiz</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {lastQuizScore ? `Scored ${lastQuizScore}%` : "Take your first quiz!"}
          </p>
        </div>
      </div>

      {/* Quiz Rules */}
      <div className="bg-muted/50 rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Info" size={20} />
          <span>Quiz Rules</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-start space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
            <span>+5 XP for each correct answer</span>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="XCircle" size={16} className="text-error mt-0.5 flex-shrink-0" />
            <span>-2 XP for each wrong answer</span>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="Clock" size={16} className="text-warning mt-0.5 flex-shrink-0" />
            <span>5 minutes time limit</span>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="SkipForward" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
            <span>Skip questions if needed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizStart;