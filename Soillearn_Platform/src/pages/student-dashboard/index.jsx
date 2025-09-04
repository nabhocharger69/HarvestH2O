import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ClassroomJoinModal from '../../components/ui/ClassroomJoinModal';
import { 
  BookOpen, 
  Users, 
  Trophy, 
  TrendingUp, 
  Plus,
  Calendar,
  Clock,
  Target,
  Brain
} from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('student');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinedClassrooms, setJoinedClassrooms] = useState([]);
  const [studentData, setStudentData] = useState({
    id: "student_001",
    name: "Alex Johnson",
    rollNumber: "ST2025001",
    class: "Grade 10-A",
    plantType: "Tomato",
    currentXP: 245,
    currentLevel: 3,
    nextLevelXP: 300,
    dailyStreak: 7
  });


  // Load student data and classrooms on component mount
  useEffect(() => {
    const loadStudentData = async () => {
      try {
        // Dynamic import to avoid blocking render
        const { default: dataManager } = await import('../../utils/dataManager');
        
        // Ensure student exists in dataManager
        let student = dataManager.getStudent(studentData.id);
        if (!student) {
          student = dataManager.createStudent({
            id: studentData.id,
            name: studentData.name,
            email: `${studentData.rollNumber}@school.edu`,
            rollNumber: studentData.rollNumber,
            class: studentData.class,
            plantType: studentData.plantType,
            xp: studentData.currentXP,
            level: studentData.currentLevel
          });
        }
        
        // Load student's classrooms
        const studentClassrooms = dataManager.getStudentClassrooms(studentData.id);
        setJoinedClassrooms(studentClassrooms);
        
        // Update student data from dataManager
        setStudentData(prev => ({
          ...prev,
          ...student
        }));
        
      } catch (error) {
        console.error('Error loading student data:', error);
      }
    };

    loadStudentData();
  }, []);

  // Listen for student profile updates
  useEffect(() => {
    const handleStudentUpdate = (event) => {
      // Check if this update is for the current student
      if (event.detail.studentId === studentData.id) {
        const loadStudentData = async () => {
          try {
            const { default: dataManager } = await import('../../utils/dataManager');
            const student = dataManager.getStudent(studentData.id);
            const studentClassrooms = dataManager.getStudentClassrooms(studentData.id);
            
            if (student) {
              setStudentData(prev => ({
                ...prev,
                ...student
              }));
            }
            setJoinedClassrooms(studentClassrooms);
            // Student dashboard updated with new profile data
          } catch (error) {
            console.error('Error updating student data:', error);
          }
        };
        loadStudentData();
      }
    };

    window.addEventListener('studentProfileUpdated', handleStudentUpdate);
    return () => window.removeEventListener('studentProfileUpdated', handleStudentUpdate);
  }, [studentData.id]);

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    if (newRole === 'teacher') {
      navigate('/teacher-dashboard');
    }
  };

  const handleJoinClassroom = () => {
    setShowJoinModal(true);
  };

  const handleJoinSuccess = (classroom) => {
    // Refresh classrooms list
    const loadClassrooms = async () => {
      try {
        const { default: dataManager } = await import('../../utils/dataManager');
        const studentClassrooms = dataManager.getStudentClassrooms(studentData.id);
        setJoinedClassrooms(studentClassrooms);
      } catch (error) {
        console.error('Error refreshing classrooms:', error);
      }
    };
    loadClassrooms();
    setShowJoinModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        userRole={userRole}
        userName={studentData?.name}
        onRoleChange={handleRoleChange}
      />
      <main className="content-offset px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {studentData?.name}!
            </h1>
            <p className="text-muted-foreground">
              Continue your plant learning journey
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              onClick={() => setShowJoinModal(true)}
              className="bg-card rounded-lg border border-border shadow-card p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Join Classroom</h3>
              <p className="text-muted-foreground text-sm">
                Enter a classroom code to join a new class
              </p>
            </div>

            <div 
              onClick={() => navigate('/quiz')}
              className="bg-card rounded-lg border border-border shadow-card p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Take Quiz</h3>
              <p className="text-muted-foreground text-sm">
                Test your Science & Nature knowledge
              </p>
            </div>

            <div className="bg-card rounded-lg border border-border shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Study Materials</h3>
              <p className="text-muted-foreground text-sm">
                Access your learning resources and notes
              </p>
            </div>

            <div className="bg-card rounded-lg border border-border shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Trophy className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Achievements</h3>
              <p className="text-muted-foreground text-sm">
                View your progress and earned badges
              </p>
            </div>
          </div>

          {/* Classroom Section */}
          <div className="bg-card rounded-lg border border-border shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">My Classrooms</h2>
                <p className="text-muted-foreground">
                  Join classrooms using the code provided by your teacher
                </p>
              </div>
              <button
                onClick={handleJoinClassroom}
                className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 
                         text-primary-foreground rounded-lg transition-colors"
              >
                <span>Join Classroom</span>
              </button>
            </div>
            
            {/* Joined Classrooms */}
            {joinedClassrooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {joinedClassrooms.map((classroom) => (
                  <div key={classroom.id} className="bg-muted/50 rounded-lg p-4 border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{classroom.name}</h3>
                        <p className="text-sm text-muted-foreground">{classroom.teacherName || 'Teacher'}</p>
                      </div>
                      <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                        {classroom.code}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{classroom.students?.length || 0} students</span>
                      <span>Joined {new Date(classroom.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-muted-foreground mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <p className="text-lg font-medium">No classrooms joined yet</p>
                  <p className="text-sm">Click "Join Classroom" to get started with your first class</p>
                </div>
              </div>
            )}
          </div>

          {/* Simple Progress Display */}
          <div className="bg-card rounded-lg border border-border shadow-card p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Progress Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{studentData.currentLevel}</div>
                <div className="text-sm text-muted-foreground">Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{studentData.currentXP}</div>
                <div className="text-sm text-muted-foreground">XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{studentData.dailyStreak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{studentData.plantType}</div>
                <div className="text-sm text-muted-foreground">Plant Type</div>
              </div>
            </div>
          </div>


          {/* Quick Actions */}
          <div className="bg-card rounded-lg border border-border shadow-card p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/student-profile')}
                className="p-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                View Profile
              </button>
              <button
                onClick={() => navigate('/quiz')}
                className="p-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Take Quiz
              </button>
              <button
                onClick={() => {/* Navigate to tasks view */}}
                className="p-4 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
              >
                Daily Tasks
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Classroom Join Modal */}
      {showJoinModal && (
        <ClassroomJoinModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          onJoinSuccess={handleJoinSuccess}
          studentId={studentData.id}
        />
      )}
    </div>
  );
};

export default StudentDashboard;