import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Target, TrendingUp, Brain, Calendar } from 'lucide-react';

const StudentQuizScores = ({ studentId, studentName }) => {
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuizHistory = async () => {
      try {
        setLoading(true);
        const { default: dataManager } = await import('../../utils/dataManager');
        const history = dataManager.getStudentQuizzes(studentId);
        setQuizHistory(history);
      } catch (error) {
        console.error('Error loading student quiz history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      loadQuizHistory();
    }
  }, [studentId]);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const calculateStats = () => {
    if (quizHistory.length === 0) return { avgScore: 0, totalQuizzes: 0, bestScore: 0, recentTrend: 'neutral' };

    const avgScore = Math.round(quizHistory.reduce((sum, quiz) => sum + quiz.score, 0) / quizHistory.length);
    const bestScore = Math.max(...quizHistory.map(quiz => quiz.score));
    
    // Calculate trend from last 3 quizzes
    let recentTrend = 'neutral';
    if (quizHistory.length >= 3) {
      const recent = quizHistory.slice(0, 3);
      const oldAvg = (recent[2].score + recent[1].score) / 2;
      const newAvg = (recent[1].score + recent[0].score) / 2;
      if (newAvg > oldAvg + 5) recentTrend = 'up';
      else if (newAvg < oldAvg - 5) recentTrend = 'down';
    }

    return {
      avgScore,
      totalQuizzes: quizHistory.length,
      bestScore,
      recentTrend
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-muted rounded"></div>
            <div className="h-3 bg-muted rounded w-5/6"></div>
            <div className="h-3 bg-muted rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (quizHistory.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Quiz Performance</h3>
        </div>
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No quiz attempts yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            {studentName} hasn't taken any quizzes yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Quiz Performance</h3>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-4 h-4 text-primary" />
          </div>
          <div className="text-lg font-bold text-foreground">{stats.avgScore}%</div>
          <div className="text-xs text-muted-foreground">Average</div>
        </div>

        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div className="text-lg font-bold text-foreground">{stats.totalQuizzes}</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>

        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-4 h-4 text-primary" />
          </div>
          <div className="text-lg font-bold text-foreground">{stats.bestScore}%</div>
          <div className="text-xs text-muted-foreground">Best</div>
        </div>

        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className={`w-4 h-4 ${
              stats.recentTrend === 'up' ? 'text-green-600' : 
              stats.recentTrend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`} />
          </div>
          <div className="text-lg font-bold text-foreground">
            {stats.recentTrend === 'up' ? '↗' : stats.recentTrend === 'down' ? '↘' : '→'}
          </div>
          <div className="text-xs text-muted-foreground">Trend</div>
        </div>
      </div>

      {/* Recent Quiz History */}
      <div>
        <h4 className="font-medium text-foreground mb-3">Recent Attempts</h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {quizHistory.slice(0, 5).map((quiz) => (
            <div key={quiz.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(quiz.score)}`}>
                  {quiz.score}%
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {quiz.correctAnswers}/{quiz.totalQuestions} correct
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(quiz.completedAt).toLocaleDateString()}
                    <Clock className="w-3 h-3 ml-2" />
                    {Math.floor(quiz.timeTaken / 60)}:{(quiz.timeTaken % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">XP Gained</div>
                <div className="text-sm font-semibold text-primary">+{Math.round(quiz.score * 0.5)}</div>
              </div>
            </div>
          ))}
        </div>
        
        {quizHistory.length > 5 && (
          <div className="text-center mt-3">
            <p className="text-xs text-muted-foreground">
              Showing 5 most recent out of {quizHistory.length} total attempts
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentQuizScores;
