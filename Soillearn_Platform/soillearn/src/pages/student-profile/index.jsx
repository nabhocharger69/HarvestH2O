import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import StudentHeader from './components/StudentHeader';
import ProgressCharts from './components/ProgressCharts';
import SensorDataSparklines from './components/SensorDataSparklines';
import PhotoTimeline from './components/PhotoTimeline';
import QuizHistory from './components/QuizHistory';
import TeacherNotes from './components/TeacherNotes';
import CommunicationTools from './components/CommunicationTools';

const StudentProfile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const studentId = searchParams?.get('id') || '1';
  
  const [userRole, setUserRole] = useState('student');
  const [activeSection, setActiveSection] = useState('overview');
  const [student, setStudent] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [progressData, setProgressData] = useState([]);
  const [sensorData, setSensorData] = useState({});
  const [photos, setPhotos] = useState([]);
  const [quizData, setQuizData] = useState([]);
  const [teacherNotes, setTeacherNotes] = useState([]);

  // Mock student data
  const mockStudent = {
    id: studentId,
    name: "Alex Johnson",
    rollNumber: "ST2025001",
    class: "Grade 10-A",
    plantType: "Tomato",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    level: 8,
    totalXP: 2450,
    currentStreak: 12,
    lastActive: "2 hours ago",
    achievements: [
      { id: 1, name: "Quiz Master", icon: "Brain", rarity: "gold", description: "Scored 90%+ on 5 consecutive quizzes" },
      { id: 2, name: "Green Thumb", icon: "Leaf", rarity: "silver", description: "Successfully grew plant for 30 days" },
      { id: 3, name: "Data Collector", icon: "BarChart", rarity: "silver", description: "Recorded sensor data for 14 consecutive days" }
    ]
  };

  // Mock progress data
  const mockProgressData = [
    { date: "Dec 1", xpGained: 25, tasksCompleted: 3, quizScore: 85 },
    { date: "Dec 2", xpGained: 30, tasksCompleted: 4, quizScore: 92 },
    { date: "Dec 3", xpGained: 15, tasksCompleted: 2, quizScore: 78 },
    { date: "Dec 4", xpGained: 35, tasksCompleted: 5, quizScore: 95 },
    { date: "Dec 5", xpGained: 20, tasksCompleted: 3, quizScore: 88 },
    { date: "Dec 6", xpGained: 40, tasksCompleted: 4, quizScore: 96 },
    { date: "Dec 7", xpGained: 25, tasksCompleted: 3, quizScore: 82 },
    { date: "Dec 8", xpGained: 30, tasksCompleted: 4, quizScore: 90 },
    { date: "Dec 9", xpGained: 35, tasksCompleted: 5, quizScore: 94 },
    { date: "Dec 10", xpGained: 20, tasksCompleted: 2, quizScore: 86 },
    { date: "Dec 11", xpGained: 45, tasksCompleted: 6, quizScore: 98 },
    { date: "Dec 12", xpGained: 25, tasksCompleted: 3, quizScore: 89 },
    { date: "Dec 13", xpGained: 30, tasksCompleted: 4, quizScore: 91 },
    { date: "Dec 14", xpGained: 35, tasksCompleted: 5, quizScore: 93 }
  ];

  // Mock sensor data
  const mockSensorData = {
    moisture: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      value: 45 + Math.random() * 20
    })),
    temperature: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      value: 20 + Math.random() * 8
    })),
    humidity: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      value: 55 + Math.random() * 25
    })),
    light: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      value: 300 + Math.random() * 400
    })),
    ph: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      value: 6.2 + Math.random() * 1.0
    })),
    pressure: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      value: 1015 + Math.random() * 10
    }))
  };

  // Mock photo timeline
  const mockPhotos = [
    {
      id: 1,
      date: "2024-11-15",
      url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
      notes: "First day of planting. Seedling looks healthy with good soil preparation.",
      milestone: "germination",
      measurements: { height: 2, leaves: 2 }
    },
    {
      id: 2,
      date: "2024-11-22",
      url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop",
      notes: "Great growth this week! First true leaves are developing nicely.",
      milestone: "first_leaves",
      measurements: { height: 8, leaves: 4 }
    },
    {
      id: 3,
      date: "2024-11-29",
      url: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&h=300&fit=crop",
      notes: "Significant growth spurt observed. Plant is responding well to current care routine.",
      milestone: "growth_spurt",
      measurements: { height: 15, leaves: 8 }
    },
    {
      id: 4,
      date: "2024-12-06",
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      notes: "Strong stem development and healthy leaf color. Excellent progress overall.",
      measurements: { height: 25, leaves: 12 }
    },
    {
      id: 5,
      date: "2024-12-13",
      url: "https://images.unsplash.com/photo-1574482620831-29d2c43c4b4e?w=400&h=300&fit=crop",
      notes: "Plant is thriving! Ready for next growth phase with proper support structure.",
      measurements: { height: 35, leaves: 16 }
    }
  ];

  // Mock quiz data
  const mockQuizData = [
    {
      id: 1,
      date: "2024-12-13",
      score: 92,
      accuracy: 92,
      questionsCorrect: 9,
      totalQuestions: 10,
      xpGained: 45,
      timeTaken: 8,
      categories: [
        { name: "Plant Biology", correct: 4, total: 4 },
        { name: "Soil Health", correct: 3, total: 4 },
        { name: "Growth Stages", correct: 2, total: 2 }
      ],
      weakAreas: ["Nutrient Deficiency"]
    },
    {
      id: 2,
      date: "2024-12-12",
      score: 88,
      accuracy: 88,
      questionsCorrect: 9,
      totalQuestions: 10,
      xpGained: 40,
      timeTaken: 7,
      categories: [
        { name: "Plant Biology", correct: 3, total: 4 },
        { name: "Soil Health", correct: 4, total: 4 },
        { name: "Growth Stages", correct: 2, total: 2 }
      ],
      weakAreas: ["Plant Diseases", "pH Balance"]
    },
    {
      id: 3,
      date: "2024-12-11",
      score: 96,
      accuracy: 96,
      questionsCorrect: 10,
      totalQuestions: 10,
      xpGained: 50,
      timeTaken: 6,
      categories: [
        { name: "Plant Biology", correct: 4, total: 4 },
        { name: "Soil Health", correct: 4, total: 4 },
        { name: "Growth Stages", correct: 2, total: 2 }
      ],
      weakAreas: []
    }
  ];

  // Mock teacher notes
  const mockTeacherNotes = [
    {
      id: 1,
      content: `Sarah has shown exceptional dedication to her plant care routine. Her daily sensor readings are consistent and she's demonstrating strong understanding of soil health principles. The improvement in her quiz scores over the past two weeks is particularly noteworthy.`,
      category: "academic",
      timestamp: "2024-12-13T10:30:00Z",
      teacherName: "Ms. Johnson",
      lastModified: null
    },
    {
      id: 2,
      content: `Excellent collaboration during group discussions about plant growth stages. Sarah actively helps other students understand complex concepts and shows natural leadership qualities in the classroom.`,
      category: "behavioral",
      timestamp: "2024-12-10T14:15:00Z",
      teacherName: "Ms. Johnson",
      lastModified: null
    },
    {
      id: 3,
      content: `Sarah achieved a 12-day streak in daily tasks completion - the highest in the class! Her consistency in plant care and data recording is setting a great example for other students.`,
      category: "achievement",
      timestamp: "2024-12-08T09:45:00Z",
      teacherName: "Ms. Johnson",
      lastModified: null
    }
  ];

  const sections = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'edit-profile', label: 'Edit Profile', icon: 'User' },
    { id: 'progress', label: 'Progress Charts', icon: 'TrendingUp' },
    { id: 'sensors', label: 'Sensor Data', icon: 'Activity' },
    { id: 'photos', label: 'Photo Timeline', icon: 'Camera' },
    { id: 'quizzes', label: 'Quiz History', icon: 'Brain' },
    { id: 'notes', label: 'Teacher Notes', icon: 'FileText' },
    { id: 'communication', label: 'Communication', icon: 'MessageSquare' }
  ];

  useEffect(() => {
    // Initialize data
    setStudent(mockStudent);
    setEditForm(mockStudent);
    setProgressData(mockProgressData);
    setSensorData(mockSensorData);
    setPhotos(mockPhotos);
    setQuizData(mockQuizData);
    setTeacherNotes(mockTeacherNotes);
  }, [studentId]);

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    if (newRole === 'teacher') {
      navigate('/teacher-dashboard');
    }
  };

  const handleProfileUpdate = async () => {
    try {
      // Dynamic import to avoid blocking render
      const { default: dataManager } = await import('../../utils/dataManager');
      
      // Update student data in localStorage via dataManager
      const result = dataManager.updateStudent(student.id, editForm);
      
      if (result.success) {
        // Update local state with the saved data
        const updatedStudent = { ...student, ...result.student };
        setStudent(updatedStudent);
        setIsEditingProfile(false);
        
        // Profile updated successfully in localStorage
        
        // Trigger a custom event to notify other components of the update
        const updateEvent = new CustomEvent('studentProfileUpdated', {
          detail: { 
            studentId: student.id, 
            updatedData: result.student,
            timestamp: new Date().toISOString()
          }
        });
        window.dispatchEvent(updateEvent);
        
        // Show success message
        alert('Profile updated successfully!');
        
        // Log the activity
        dataManager.logActivity({
          type: 'profile_updated',
          studentId: student.id,
          studentName: result.student.name,
          field: 'profile_information',
          details: `Profile updated: ${Object.keys(editForm).join(', ')}`
        });
        
      } else {
        throw new Error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating student profile:', error);
      alert('Failed to save profile changes. Please try again.');
    }
  };

  const handleAvatarUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditForm({ ...editForm, avatar: e?.target?.result });
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleAddNote = (note) => {
    setTeacherNotes(prev => [note, ...prev]);
  };

  const handleUpdateNote = (noteId, updates) => {
    setTeacherNotes(prev => prev?.map(note => 
      note?.id === noteId ? { ...note, ...updates } : note
    ));
  };

  const handleDeleteNote = (noteId) => {
    setTeacherNotes(prev => prev?.filter(note => note?.id !== noteId));
  };

  const handleSendFeedback = (feedback) => {
    // Send feedback to teacher
    // In a real app, this would send the feedback via API
  };

  const handleScheduleMeeting = (meeting) => {
    // Schedule meeting with teacher
    // In a real app, this would create a calendar event
  };

  const handleSendCelebration = (celebration) => {
    // Send celebration notification
    // In a real app, this would send a celebration notification
  };

  const handleExportReport = () => {
    // Generate comprehensive progress report
    const reportData = {
      student,
      progressData,
      quizData,
      teacherNotes,
      generatedAt: new Date()?.toISOString()
    };
    
    // Export student progress report
    // In a real app, this would generate and download a PDF report
  };

  const renderSectionContent = () => {
    if (!student) return null;

    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProgressCharts progressData={progressData} />
              <SensorDataSparklines sensorData={sensorData} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PhotoTimeline photos={photos?.slice(-3)} />
              </div>
              <div className="space-y-4">
                <div className="bg-card rounded-lg border border-border shadow-card p-4">
                  <h3 className="font-semibold text-foreground mb-3">Recent Quiz Performance</h3>
                  <div className="space-y-3">
                    {quizData?.slice(0, 3)?.map((quiz) => (
                      <div key={quiz?.id} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {new Date(quiz.date)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          quiz?.score >= 90 ? 'bg-success/10 text-success' :
                          quiz?.score >= 80 ? 'bg-warning/10 text-warning': 'bg-error/10 text-error'
                        }`}>
                          {quiz?.score}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border border-border shadow-card p-4">
                  <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveSection('communication')}
                      iconName="MessageSquare"
                      iconSize={14}
                      className="w-full justify-start"
                    >
                      Send Feedback
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveSection('notes')}
                      iconName="Plus"
                      iconSize={14}
                      className="w-full justify-start"
                    >
                      Add Note
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportReport}
                      iconName="Download"
                      iconSize={14}
                      className="w-full justify-start"
                    >
                      Export Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'edit-profile':
        return (
          <div className="max-w-2xl">
            <div className="bg-card rounded-lg border border-border shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">Edit Profile</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditForm(student);
                      setIsEditingProfile(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleProfileUpdate}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
                      {editForm?.avatar ? (
                        <img
                          src={editForm?.avatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon name="User" size={32} className="text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      title="Upload profile picture"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1.5 bg-primary rounded-full text-primary-foreground cursor-pointer">
                      <Icon name="Camera" size={12} />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Profile Picture</p>
                    <p className="text-xs text-muted-foreground">Click to change</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Full Name
                    </label>
                    <Input
                      value={editForm?.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e?.target?.value })}
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Roll Number
                    </label>
                    <Input
                      value={editForm?.rollNumber || ''}
                      onChange={(e) => setEditForm({ ...editForm, rollNumber: e?.target?.value })}
                      placeholder="Enter roll number"
                      disabled
                      className="opacity-60"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Roll number cannot be changed</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Class
                    </label>
                    <Input
                      value={editForm?.class || ''}
                      onChange={(e) => setEditForm({ ...editForm, class: e?.target?.value })}
                      placeholder="Enter class"
                      disabled
                      className="opacity-60"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Contact teacher to change class</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Plant Type
                    </label>
                    <select
                      value={editForm?.plantType || ''}
                      onChange={(e) => setEditForm({ ...editForm, plantType: e?.target?.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Tomato">Tomato</option>
                      <option value="Lettuce">Lettuce</option>
                      <option value="Basil">Basil</option>
                      <option value="Spinach">Spinach</option>
                      <option value="Pepper">Pepper</option>
                    </select>
                  </div>
                </div>

                {/* Profile Statistics (Read-only) */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Profile Statistics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Current Level</p>
                      <p className="text-lg font-semibold text-foreground">{student?.level}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Total XP</p>
                      <p className="text-lg font-semibold text-foreground">{student?.totalXP}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Current Streak</p>
                      <p className="text-lg font-semibold text-foreground">{student?.currentStreak} days</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Statistics are updated automatically based on your activity</p>
                </div>

                {/* Achievements Preview */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Recent Achievements</h4>
                  <div className="flex flex-wrap gap-2">
                    {student?.achievements?.map((achievement) => (
                      <div
                        key={achievement?.id}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                          achievement?.rarity === 'gold' ?'bg-yellow-500/10 text-yellow-700 border border-yellow-500/20' :'bg-gray-500/10 text-gray-700 border border-gray-500/20'
                        }`}
                      >
                        <Icon name={achievement?.icon} size={12} />
                        {achievement?.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'progress':
        return <ProgressCharts progressData={progressData} />;
      case 'sensors':
        return <SensorDataSparklines sensorData={sensorData} />;
      case 'photos':
        return <PhotoTimeline photos={photos} />;
      case 'quizzes':
        return <QuizHistory quizData={quizData} />;
      case 'notes':
        return (
          <TeacherNotes
            studentId={student?.id}
            notes={teacherNotes}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
          />
        );
      case 'communication':
        return (
          <CommunicationTools
            studentName={student?.name}
            onSendFeedback={handleSendFeedback}
            onScheduleMeeting={handleScheduleMeeting}
            onSendCelebration={handleSendCelebration}
          />
        );
      default:
        return null;
    }
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          userRole={userRole}
          userName="Teacher"
          onRoleChange={handleRoleChange}
          onNotificationClick={() => {}}
          onMarkAsRead={() => {}}
          onMarkAllAsRead={() => {}}
          onToggle={() => {}}
        />
        <div className="content-offset flex items-center justify-center h-96">
          <div className="text-center">
            <Icon name="Loader" size={32} className="text-muted-foreground animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading student profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole={userRole}
        userName="Teacher"
        onRoleChange={handleRoleChange}
        onNotificationClick={() => {}}
        onMarkAsRead={() => {}}
        onMarkAllAsRead={() => {}}
        onToggle={() => {}}
      />
      <div className="content-offset">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Navigation Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/classroom-management')}
              iconName="ArrowLeft"
              iconSize={16}
            >
              Back to Classrooms
            </Button>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Student Profile</span>
          </div>

          {/* Student Header */}
          <div className="mb-8">
            <StudentHeader student={student} />
          </div>

          {/* Section Navigation */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-card rounded-lg border border-border shadow-card p-4 sticky top-24">
                <h3 className="font-semibold text-foreground mb-4">Profile Sections</h3>
                <nav className="space-y-1">
                  {sections?.map((section) => (
                    <button
                      key={section?.id}
                      onClick={() => setActiveSection(section?.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                        activeSection === section?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={section?.icon} size={16} />
                      {section?.label}
                    </button>
                  ))}
                </nav>

                {/* Export Report Button */}
                <div className="mt-6 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportReport}
                    iconName="Download"
                    iconSize={14}
                    className="w-full"
                  >
                    Export Report
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {renderSectionContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;