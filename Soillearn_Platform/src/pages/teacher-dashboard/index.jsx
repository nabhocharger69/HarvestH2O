import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import ClassroomCard from './components/ClassroomCard';
import MetricsPanel from './components/MetricsPanel';
import ActivityFeed from './components/ActivityFeed';
import CreateClassroomModal from './components/CreateClassroomModal';
import SearchAndFilters from './components/SearchAndFilters';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('teacher');
  const [viewMode, setViewMode] = useState('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filters, setFilters] = useState({
    activity: 'all',
    engagement: 'all',
    completion: 'all'
  });

  // Mock data for classrooms
  const [classrooms, setClassrooms] = useState([
    {
      id: 1,
      title: "Biology - Plant Growth Study",
      code: "BIO123",
      studentCount: 24,
      activityLevel: "high",
      avgEngagement: 87,
      completionRate: 92,
      avgScore: 8.4,
      subject: "Biology",
      gradeLevel: "9th Grade",
      createdAt: new Date('2024-08-15'),
      recentActivities: [
        {
          id: 1,
          description: "Sarah completed daily quiz with 95% score",
          timestamp: new Date(Date.now() - 30 * 60 * 1000)
        },
        {
          id: 2,
          description: "Mike uploaded plant photo",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }
      ]
    },
    {
      id: 2,
      title: "Environmental Science Lab",
      code: "ENV456",
      studentCount: 18,
      activityLevel: "medium",
      avgEngagement: 73,
      completionRate: 85,
      avgScore: 7.8,
      subject: "Environmental Science",
      gradeLevel: "10th Grade",
      createdAt: new Date('2024-08-20'),
      recentActivities: [
        {
          id: 3,
          description: "Class average improved by 12%",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
        },
        {
          id: 4,
          description: "New sensor data recorded",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
        }
      ]
    },
    {
      id: 3,
      title: "Advanced Botany Research",
      code: "BOT789",
      studentCount: 12,
      activityLevel: "low",
      avgEngagement: 45,
      completionRate: 67,
      avgScore: 6.9,
      subject: "Botany",
      gradeLevel: "11th Grade",
      createdAt: new Date('2024-09-01'),
      recentActivities: [
        {
          id: 5,
          description: "Assignment deadline approaching",
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
        }
      ]
    }
  ]);

  // Mock recent activities across all classrooms
  const recentActivities = [
    {
      id: 1,
      type: 'quiz_completed',
      studentName: 'Sarah Johnson',
      description: 'Completed daily quiz with 95% score',
      classroom: 'BIO123',
      timestamp: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      id: 2,
      type: 'photo_uploaded',
      studentName: 'Mike Chen',
      description: 'Uploaded plant growth photo - Day 14',
      classroom: 'BIO123',
      timestamp: new Date(Date.now() - 45 * 60 * 1000)
    },
    {
      id: 3,
      type: 'achievement_earned',
      studentName: 'Emma Davis',
      description: 'Earned "Green Thumb" achievement',
      classroom: 'ENV456',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 4,
      type: 'level_up',
      studentName: 'Alex Rodriguez',
      description: 'Reached Level 5 - Plant Expert',
      classroom: 'BIO123',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
    },
    {
      id: 5,
      type: 'device_connected',
      studentName: 'Lisa Wang',
      description: 'Connected new soil moisture sensor',
      classroom: 'ENV456',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  ];

  // Calculate aggregate metrics
  const metrics = {
    totalStudents: classrooms?.reduce((sum, classroom) => sum + classroom?.studentCount, 0),
    avgEngagement: Math.round(classrooms?.reduce((sum, classroom) => sum + classroom?.avgEngagement, 0) / classrooms?.length),
    completionRate: Math.round(classrooms?.reduce((sum, classroom) => sum + classroom?.completionRate, 0) / classrooms?.length),
    activeClassrooms: classrooms?.filter(c => c?.activityLevel !== 'low')?.length,
    studentChange: 8,
    engagementChange: 5,
    completionChange: -2,
    classroomChange: 0
  };

  // Filter classrooms based on search and filters
  const filteredClassrooms = classrooms?.filter(classroom => {
    // Search filter
    if (searchTerm && !classroom?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) &&
        !classroom?.code?.toLowerCase()?.includes(searchTerm?.toLowerCase())) {
      return false;
    }

    // Activity filter
    if (filters?.activity !== 'all' && classroom?.activityLevel !== filters?.activity) {
      return false;
    }

    // Engagement filter
    if (filters?.engagement !== 'all') {
      const engagement = classroom?.avgEngagement;
      if (filters?.engagement === 'high' && engagement < 80) return false;
      if (filters?.engagement === 'medium' && (engagement < 50 || engagement >= 80)) return false;
      if (filters?.engagement === 'low' && engagement >= 50) return false;
    }

    // Completion filter
    if (filters?.completion !== 'all') {
      const completion = classroom?.completionRate;
      if (filters?.completion === 'high' && completion < 80) return false;
      if (filters?.completion === 'medium' && (completion < 50 || completion >= 80)) return false;
      if (filters?.completion === 'low' && completion >= 50) return false;
    }

    return true;
  });

  // Listen for student profile updates to refresh data
  useEffect(() => {
    const handleStudentProfileUpdate = (event) => {
      // Received student profile update
      // Trigger a refresh of classroom data and activities
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('studentProfileUpdated', handleStudentProfileUpdate);
    return () => {
      window.removeEventListener('studentProfileUpdated', handleStudentProfileUpdate);
    };
  }, []);

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    if (newRole === 'student') {
      navigate('/student-dashboard');
    }
  };

  const handleCreateClassroom = (newClassroom) => {
    setClassrooms(prev => [...prev, newClassroom]);
  };

  const handleViewRoster = (classroom) => {
    navigate('/classroom-management', { state: { classroomId: classroom?.id, tab: 'roster' } });
  };

  const handleViewAnalytics = (classroom) => {
    navigate('/classroom-management', { state: { classroomId: classroom?.id, tab: 'analytics' } });
  };

  const handleManageSettings = (classroom) => {
    navigate('/classroom-management', { state: { classroomId: classroom?.id, tab: 'settings' } });
  };

  const handleNotificationClick = (notification) => {
    // Handle notification click
  };

  const handleMarkAsRead = (notificationId) => {
    // Mark notification as read
  };

  const handleMarkAllAsRead = () => {
    // Mark all notifications as read
  };

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
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Teacher Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your classrooms and monitor student progress
              </p>
            </div>
            
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              iconName="Plus"
              iconPosition="left"
              className="mt-4 sm:mt-0"
            >
              Create Classroom
            </Button>
          </div>

          {/* Metrics Panel */}
          <MetricsPanel metrics={metrics} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-2">
              {/* Search and Filters */}
              <SearchAndFilters
                onSearch={setSearchTerm}
                onFilterChange={setFilters}
                onViewModeChange={setViewMode}
                viewMode={viewMode}
                totalClassrooms={filteredClassrooms?.length}
              />

              {/* Classrooms Grid/List */}
              <div className="mt-6">
                {filteredClassrooms?.length === 0 ? (
                  <div className="card-elevated p-12 text-center bg-card">
                    <Icon name="School" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No classrooms found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {searchTerm || Object.values(filters)?.some(f => f !== 'all')
                        ? 'Try adjusting your search or filters' :'Create your first classroom to get started'
                      }
                    </p>
                    {!searchTerm && Object.values(filters)?.every(f => f === 'all') && (
                      <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        iconName="Plus"
                        iconPosition="left"
                      >
                        Create Classroom
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className={
                    viewMode === 'grid' ?'grid grid-cols-1 md:grid-cols-2 gap-6' :'space-y-4'
                  }>
                    {filteredClassrooms?.map((classroom) => (
                      <ClassroomCard
                        key={classroom?.id}
                        classroom={classroom}
                        onViewRoster={handleViewRoster}
                        onViewAnalytics={handleViewAnalytics}
                        onManageSettings={handleManageSettings}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Activity Feed Sidebar */}
            <div className="xl:col-span-1">
              <ActivityFeed activities={recentActivities} />
            </div>
          </div>
        </div>
      </main>
      {/* Create Classroom Modal */}
      <CreateClassroomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateClassroom={handleCreateClassroom}
      />
    </div>
  );
};

export default TeacherDashboard;