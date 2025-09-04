import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import QuizComponent from '../../components/quiz/QuizComponent';
import { Trophy, Clock, Target, TrendingUp } from 'lucide-react';

const QuizPage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('student');
  const [studentData, setStudentData] = useState({
    id: "student_001",
    name: "Alex Johnson"
  });
  const [quizHistory, setQuizHistory] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);

  // Load student quiz history
  useEffect(() => {
    const loadQuizHistory = async () => {
      try {
        const { default: dataManager } = await import('../../utils/dataManager');
        const history = dataManager.getStudentQuizzes(studentData.id);
        setQuizHistory(history);
      } catch (error) {
        console.error('Error loading quiz history:', error);
      }
    };

    loadQuizHistory();
  }, [studentData.id]);

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    if (newRole === 'teacher') {
      navigate('/teacher-dashboard');
    }
  };

  const handleQuizComplete = (results) => {
    // Refresh quiz history
    const loadQuizHistory = async () => {
      try {
        const { default: dataManager } = await import('../../utils/dataManager');
        const history = dataManager.getStudentQuizzes(studentData.id);
        setQuizHistory(history);
      } catch (error) {
        console.error('Error loading quiz history:', error);
      }
    };
    loadQuizHistory();
    setShowQuiz(false);
  };

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

  if (showQuiz) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          userRole={userRole}
          userName={studentData?.name}
          onRoleChange={handleRoleChange}
        />
        <main className="content-offset px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setShowQuiz(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Quiz Dashboard
              </button>
            </div>
            <QuizComponent
              studentId={studentData.id}
              onQuizComplete={handleQuizComplete}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole={userRole}
        userName={studentData?.name}
        onRoleChange={handleRoleChange}
      />
      <main className="content-offset px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Science & Nature Quiz</h1>
            <p className="text-muted-foreground">
              Test your knowledge with questions from the Trivia Database
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-card rounded-lg border border-border shadow-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold text-foreground">{stats.avgScore}%</p>
                </div>
                <Target className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border shadow-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Quizzes</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalQuizzes}</p>
                </div>
                <Clock className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border shadow-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Best Score</p>
                  <p className="text-2xl font-bold text-foreground">{stats.bestScore}%</p>
                </div>
                <Trophy className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border shadow-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Trend</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.recentTrend === 'up' ? '↗' : stats.recentTrend === 'down' ? '↘' : '→'}
                  </p>
                </div>
                <TrendingUp className={`w-8 h-8 ${
                  stats.recentTrend === 'up' ? 'text-green-600' : 
                  stats.recentTrend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`} />
              </div>
            </div>
          </div>

          {/* Start Quiz Section */}
          <div className="bg-card rounded-lg border border-border shadow-card p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready for a New Challenge?</h2>
            <p className="text-muted-foreground mb-6">
              Take a 10-question Science & Nature quiz with questions from the Trivia Database.
              You'll have 10 minutes to complete all questions.
            </p>
            <button
              onClick={() => setShowQuiz(true)}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg font-semibold"
            >
              Start New Quiz
            </button>
          </div>

          {/* Quiz History */}
          {quizHistory.length > 0 && (
            <div className="bg-card rounded-lg border border-border shadow-card p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6">Quiz History</h3>
              <div className="space-y-4">
                {quizHistory.slice(0, 10).map((quiz) => (
                  <div key={quiz.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(quiz.score)}`}>
                          {quiz.score}%
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {quiz.correctAnswers}/{quiz.totalQuestions} correct
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(quiz.completedAt).toLocaleDateString()} • 
                            {Math.floor(quiz.timeTaken / 60)}:{(quiz.timeTaken % 60).toString().padStart(2, '0')} taken
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">XP Gained</p>
                      <p className="font-semibold text-primary">+{Math.round(quiz.score * 0.5)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {quizHistory.length > 10 && (
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing 10 most recent quizzes out of {quizHistory.length} total
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {quizHistory.length === 0 && (
            <div className="bg-card rounded-lg border border-border shadow-card p-8 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Quiz History Yet</h3>
              <p className="text-muted-foreground">
                Take your first quiz to start tracking your progress and earning XP!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
