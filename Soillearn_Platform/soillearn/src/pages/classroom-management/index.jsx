import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ClassroomCard from '../../components/ui/ClassroomCard';
import CreateClassroomModal from '../../components/ui/CreateClassroomModal';
import ClassroomQuizOverview from '../../components/teacher/ClassroomQuizOverview';
import ClassroomAnalytics from './components/ClassroomAnalytics';
import StudentRosterTable from './components/StudentRosterTable';
import { Plus, Search, Filter, Users, BookOpen, TrendingUp, Brain } from 'lucide-react';
import BulkActionsModal from './components/BulkActionsModal';
import AddNoteModal from './components/AddNoteModal';
import Button from '../../components/ui/Button';
// Remove direct import - will use dynamic import instead

const ClassroomManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classroomId = searchParams?.get('id') || '1';

  // State management
  const [userRole, setUserRole] = useState('teacher');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [bulkActionModal, setBulkActionModal] = useState({ isOpen: false, type: null });
  const [addNoteModal, setAddNoteModal] = useState({ isOpen: false, student: null });
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClassroom, setNewClassroom] = useState({ name: '', description: '', teacherId: 'teacher1' });

  // Load classrooms on component mount
  useEffect(() => {
    loadClassrooms();
  }, []);

  // Listen for student profile updates to refresh classroom data
  useEffect(() => {
    const handleStudentProfileUpdate = (event) => {
      // Received student profile update
      // Refresh classroom data to reflect updated student information
      loadClassrooms();
    };

    window.addEventListener('studentProfileUpdated', handleStudentProfileUpdate);
    return () => {
      window.removeEventListener('studentProfileUpdated', handleStudentProfileUpdate);
    };
  }, []);

  const loadClassrooms = async () => {
    try {
      setLoading(true);
      const { default: dataManager } = await import('../../utils/dataManager');
      const teacherClassrooms = dataManager.getTeacherClassrooms('teacher1');
      setClassrooms(teacherClassrooms);
    } catch (error) {
      console.error('Error loading classrooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    
    if (!newClassroom.name.trim()) {
      alert('Please enter a classroom name');
      return;
    }

    try {
      const { default: dataManager } = await import('../../utils/dataManager');
      const classroom = dataManager.createClassroom({
        ...newClassroom,
        teacherId: 'teacher1'
      });
      
      setClassrooms(prev => [...prev, classroom]);
      setNewClassroom({ name: '', description: '', teacherId: 'teacher1' });
      setShowCreateForm(false);
      
      alert(`Classroom created successfully! Code: ${classroom.code}`);
    } catch (error) {
      console.error('Error creating classroom:', error);
      alert('Failed to create classroom');
    }
  };

  const handleClassroomUpdate = (updatedClassroom) => {
    setClassrooms(prev => 
      prev.map(c => c.id === updatedClassroom.id ? updatedClassroom : c)
    );
  };

  // Mock students data
  const studentsData = [
    {
      id: "1",
      name: "Sarah Johnson",
      rollNumber: "2024001",
      plantType: "tomato",
      level: 8,
      xp: 3250,
      isOnline: true,
      lastSeen: "Now",
      joinedDate: "Sep 15, 2024"
    },
    {
      id: "2",
      name: "Michael Chen",
      rollNumber: "2024002",
      plantType: "basil",
      level: 6,
      xp: 2180,
      isOnline: false,
      lastSeen: "Today",
      joinedDate: "Sep 16, 2024"
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      rollNumber: "2024003",
      plantType: "lettuce",
      level: 9,
      xp: 4120,
      isOnline: true,
      lastSeen: "Now",
      joinedDate: "Sep 15, 2024"
    },
    {
      id: "4",
      name: "James Wilson",
      rollNumber: "2024004",
      plantType: "spinach",
      level: 5,
      xp: 1890,
      isOnline: false,
      lastSeen: "2 days ago",
      joinedDate: "Sep 18, 2024"
    },
    {
      id: "5",
      name: "Olivia Brown",
      rollNumber: "2024005",
      plantType: "mint",
      level: 7,
      xp: 2750,
      isOnline: false,
      lastSeen: "Today",
      joinedDate: "Sep 17, 2024"
    },
    {
      id: "6",
      name: "David Kim",
      rollNumber: "2024006",
      plantType: "tomato",
      level: 10,
      xp: 5200,
      isOnline: true,
      lastSeen: "Now",
      joinedDate: "Sep 15, 2024"
    }
  ];

  // Mock analytics data
  const analyticsData = {
    weeklyActivity: [
      { day: 'Mon', logins: 22, quizzes: 18 },
      { day: 'Tue', logins: 25, quizzes: 20 },
      { day: 'Wed', logins: 28, quizzes: 24 },
      { day: 'Thu', logins: 24, quizzes: 19 },
      { day: 'Fri', logins: 26, quizzes: 22 },
      { day: 'Sat', logins: 15, quizzes: 12 },
      { day: 'Sun', logins: 18, quizzes: 14 }
    ],
    levelDistribution: [
      { name: 'Level 1-3', count: 5 },
      { name: 'Level 4-6', count: 12 },
      { name: 'Level 7-9', count: 8 },
      { name: 'Level 10+', count: 3 }
    ],
    engagementTrends: [
      { date: '12/26', engagement: 85 },
      { date: '12/27', engagement: 88 },
      { date: '12/28', engagement: 92 },
      { date: '12/29', engagement: 89 },
      { date: '12/30', engagement: 94 },
      { date: '12/31', engagement: 87 },
      { date: '01/01', engagement: 91 }
    ],
    topPerformers: [
      { id: "6", name: "David Kim", level: 10, xp: 5200 },
      { id: "3", name: "Emma Rodriguez", level: 9, xp: 4120 },
      { id: "1", name: "Sarah Johnson", level: 8, xp: 3250 },
      { id: "5", name: "Olivia Brown", level: 7, xp: 2750 },
      { id: "2", name: "Michael Chen", level: 6, xp: 2180 }
    ]
  };

  // Event handlers
  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    if (newRole === 'student') {
      navigate('/student-dashboard');
    }
  };

  const handleStudentSelect = (studentId, isSelected) => {
    if (isSelected) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev?.filter(id => id !== studentId));
    }
  };

  const handleSelectAll = (selectAll) => {
    if (selectAll) {
      setSelectedStudents(studentsData?.map(student => student?.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleBulkAction = (actionType, studentIds) => {
    setBulkActionModal({ isOpen: true, type: actionType });
  };

  const handleBulkActionConfirm = (actionData) => {
    // Process bulk action
    // Here you would implement the actual bulk action logic
    setBulkActionModal({ isOpen: false, type: null });
    setSelectedStudents([]);
  };

  const handleAddNote = (studentId) => {
    const student = studentsData?.find(s => s?.id === studentId);
    setAddNoteModal({ isOpen: true, student });
  };

  const handleSaveNote = (noteData) => {
    // Save note to student record
    // Here you would implement the actual note saving logic
    setAddNoteModal({ isOpen: false, student: null });
  };

  const handleRegenerateCode = async (classroomId) => {
    try {
      const { default: dataManager } = await import('../../utils/dataManager');
      const newCode = dataManager.regenerateClassroomCode(classroomId);
      if (newCode) {
        loadClassrooms(); // Refresh the list
        alert(`New classroom code: ${newCode}`);
      }
    } catch (error) {
      console.error('Error regenerating code:', error);
      alert('Failed to regenerate code');
    }
  };

  const handleExportData = () => {
    // Export classroom data
    // Implement data export logic
  };

  const handleSettings = () => {
    // Open classroom settings
    // Implement settings modal or navigation
  };

  // Add missing handler functions for Header component
  const handleNotificationClick = (notificationId) => {
    // Handle notification click
  };

  const handleMarkAsRead = (notificationId) => {
    // Mark notification as read
  };

  const handleMarkAllAsRead = () => {
    // Mark all notifications as read
  };

  // Add missing handler function for StudentRosterTable component
  const handleViewProfile = (studentId) => {
    // Navigate to student profile
    // Navigate to student profile or open profile modal
  };

  // Redirect non-teachers
  useEffect(() => {
    if (userRole !== 'teacher') {
      navigate('/teacher-dashboard');
    }
  }, [userRole, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole={userRole}
        userName="Dr. Smith"
        onRoleChange={handleRoleChange}
        onNotificationClick={handleNotificationClick}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
      <main className="content-offset px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Classroom Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Create and manage your classrooms</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>+</span>
              <span>Create Classroom</span>
            </button>
          </div>

          {/* Create Classroom Form */}
          {showCreateForm && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Classroom</h2>
              <form onSubmit={handleCreateClassroom} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Classroom Name *
                  </label>
                  <input
                    type="text"
                    value={newClassroom.name}
                    onChange={(e) => setNewClassroom(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Advanced Plant Biology - Grade 10A"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newClassroom.description}
                    onChange={(e) => setNewClassroom(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the classroom..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Create Classroom
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Classrooms Grid */}
          {classrooms.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {classrooms.map((classroom) => (
                <ClassroomCard
                  key={classroom.id}
                  classroom={classroom}
                  onUpdate={handleClassroomUpdate}
                  showActions={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏫</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Classrooms Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Create your first classroom to start managing students and assignments.
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Create Your First Classroom
              </button>
            </div>
          )}

          {/* View Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-foreground">
                {showAnalytics ? 'Classroom Analytics' : 'Student Roster'}
              </h2>
              <span className="achievement-badge bg-muted text-muted-foreground">
                {studentsData?.length} students
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant={showAnalytics ? 'outline' : 'default'}
                iconName="Users"
                onClick={() => setShowAnalytics(false)}
              >
                Students
              </Button>
              <Button
                variant={showAnalytics ? 'default' : 'outline'}
                iconName="BarChart3"
                onClick={() => setShowAnalytics(true)}
              >
                Analytics
              </Button>
            </div>
          </div>

          {/* Main Content */}
          {showAnalytics ? (
            <ClassroomAnalytics analyticsData={analyticsData} />
          ) : (
            <StudentRosterTable
              students={studentsData}
              selectedStudents={selectedStudents}
              onStudentSelect={handleStudentSelect}
              onSelectAll={handleSelectAll}
              onBulkAction={handleBulkAction}
              onAddNote={handleAddNote}
              onViewProfile={handleViewProfile}
            />
          )}

          {/* Quick Actions */}
          {!showAnalytics && (
            <div className="bg-card rounded-lg border shadow-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  iconName="UserPlus"
                  className="justify-start h-auto p-4"
                  onClick={() => {/* Open invite students modal */}}
                >
                  <div className="text-left">
                    <div className="font-medium">Invite Students</div>
                    <div className="text-sm text-muted-foreground font-caption">
                      Share classroom code or send invitations
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  iconName="ClipboardList"
                  className="justify-start h-auto p-4"
                  onClick={() => handleBulkAction('task', studentsData?.map(s => s?.id))}
                >
                  <div className="text-left">
                    <div className="font-medium">Assign Task</div>
                    <div className="text-sm text-muted-foreground font-caption">
                      Create assignments for all students
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  iconName="MessageSquare"
                  className="justify-start h-auto p-4"
                  onClick={() => handleBulkAction('message', studentsData?.map(s => s?.id))}
                >
                  <div className="text-left">
                    <div className="font-medium">Send Announcement</div>
                    <div className="text-sm text-muted-foreground font-caption">
                      Broadcast message to all students
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Modals */}
      <BulkActionsModal
        isOpen={bulkActionModal?.isOpen}
        actionType={bulkActionModal?.type}
        selectedStudents={selectedStudents}
        onClose={() => setBulkActionModal({ isOpen: false, type: null })}
        onConfirm={handleBulkActionConfirm}
      />
      <AddNoteModal
        isOpen={addNoteModal?.isOpen}
        student={addNoteModal?.student}
        onClose={() => setAddNoteModal({ isOpen: false, student: null })}
        onSaveNote={handleSaveNote}
      />
    </div>
  );
};

export default ClassroomManagement;