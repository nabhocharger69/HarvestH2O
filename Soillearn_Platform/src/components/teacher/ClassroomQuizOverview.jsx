import React, { useState, useEffect } from 'react';
import { Brain, Trophy, TrendingUp, Users, Calendar, Clock } from 'lucide-react';
import StudentQuizScores from './StudentQuizScores';

const ClassroomQuizOverview = ({ classroomId, students = [] }) => {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const loadClassroomQuizData = async () => {
      try {
        setLoading(true);
        const { default: dataManager } = await import('../../utils/dataManager');
        
        // Get all quizzes for this classroom
        const classroomQuizzes = dataManager.getClassroomQuizzes(classroomId);
        
        // Get student data with quiz stats
        const studentsWithQuizData = students.map(student => {
          const studentQuizzes = classroomQuizzes.filter(quiz => quiz.studentId === student.id);
          const avgScore = studentQuizzes.length > 0 
            ? Math.round(studentQuizzes.reduce((sum, quiz) => sum + quiz.score, 0) / studentQuizzes.length)
            : 0;
          const totalQuizzes = studentQuizzes.length;
          const bestScore = studentQuizzes.length > 0 
            ? Math.max(...studentQuizzes.map(quiz => quiz.score))
            : 0;
          const lastQuiz = studentQuizzes.length > 0 
            ? studentQuizzes.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0]
            : null;

          return {
            ...student,
            quizStats: {
              avgScore,
              totalQuizzes,
              bestScore,
              lastQuiz,
              quizzes: studentQuizzes
            }
          };
        });

        setQuizData(studentsWithQuizData);
      } catch (error) {
        console.error('Error loading classroom quiz data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (classroomId && students.length > 0) {
      loadClassroomQuizData();
    }
  }, [classroomId, students]);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const calculateClassStats = () => {
    const studentsWithQuizzes = quizData.filter(student => student.quizStats.totalQuizzes > 0);
    if (studentsWithQuizzes.length === 0) return { avgClassScore: 0, totalAttempts: 0, participationRate: 0 };

    const avgClassScore = Math.round(
      studentsWithQuizzes.reduce((sum, student) => sum + student.quizStats.avgScore, 0) / studentsWithQuizzes.length
    );
    const totalAttempts = studentsWithQuizzes.reduce((sum, student) => sum + student.quizStats.totalQuizzes, 0);
    const participationRate = Math.round((studentsWithQuizzes.length / students.length) * 100);

    return { avgClassScore, totalAttempts, participationRate };
  };

  const classStats = calculateClassStats();

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedStudent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedStudent(null)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Overview
          </button>
          <h3 className="text-lg font-semibold text-foreground">
            {selectedStudent.name} - Quiz Performance
          </h3>
        </div>
        <StudentQuizScores 
          studentId={selectedStudent.id} 
          studentName={selectedStudent.name}
        />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold text-foreground">Quiz Performance Overview</h3>
      </div>

      {/* Class Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <Trophy className="w-6 h-6 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold text-foreground">{classStats.avgClassScore}%</div>
          <div className="text-sm text-muted-foreground">Class Average</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold text-foreground">{classStats.participationRate}%</div>
          <div className="text-sm text-muted-foreground">Participation Rate</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold text-foreground">{classStats.totalAttempts}</div>
          <div className="text-sm text-muted-foreground">Total Attempts</div>
        </div>
      </div>

      {/* Student List */}
      <div>
        <h4 className="font-medium text-foreground mb-4">Student Performance</h4>
        {quizData.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No students enrolled yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {quizData.map((student) => (
              <div 
                key={student.id} 
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setSelectedStudent(student)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{student.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {student.quizStats.totalQuizzes > 0 
                        ? `${student.quizStats.totalQuizzes} quiz${student.quizStats.totalQuizzes !== 1 ? 'es' : ''} taken`
                        : 'No quizzes taken'
                      }
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {student.quizStats.totalQuizzes > 0 ? (
                    <>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(student.quizStats.avgScore)}`}>
                          {student.quizStats.avgScore}%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Average</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">{student.quizStats.bestScore}%</div>
                        <div className="text-xs text-muted-foreground">Best</div>
                      </div>
                      {student.quizStats.lastQuiz && (
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(student.quizStats.lastQuiz.completedAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">Last attempt</div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">No attempts</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomQuizOverview;
