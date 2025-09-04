import React, { useState, useEffect } from 'react';
import { Plus, Users, Calendar, BookOpen } from 'lucide-react';
import ClassroomJoinModal from './ClassroomJoinModal';

const StudentDashboardJoin = ({ studentId }) => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [enrolledClassrooms, setEnrolledClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentClassrooms();
  }, [studentId]);

  // Listen for student profile updates to refresh student name in classroom cards
  useEffect(() => {
    const handleStudentProfileUpdate = (event) => {
      const { studentId: updatedStudentId } = event.detail;
      // If this is the current student, refresh their classroom list
      if (updatedStudentId === studentId) {
        loadStudentClassrooms();
      }
    };

    window.addEventListener('studentProfileUpdated', handleStudentProfileUpdate);
    return () => {
      window.removeEventListener('studentProfileUpdated', handleStudentProfileUpdate);
    };
  }, [studentId]);

  const loadStudentClassrooms = async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }
    
    try {
      const dataManager = await import('../../utils/dataManager');
      const dm = dataManager.default;
      
      // Ensure student exists before trying to get classrooms
      let student = dm.getStudent(studentId);
      if (!student) {
        // Student not found, creating default student
        student = dm.createStudent({
          id: studentId,
          name: "Student User",
          rollNumber: "ST001",
          class: "Grade 10",
          plantType: "Tomato",
          level: 1,
          xp: 0,
          email: `${studentId}@school.edu`,
          classrooms: []
        });
      }
      
      const classrooms = dm.getStudentClassrooms(studentId);
      setEnrolledClassrooms(classrooms || []);
    } catch (error) {
      console.error('Error loading student classrooms:', error);
      setEnrolledClassrooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSuccess = (classroom) => {
    // Refresh the enrolled classrooms list
    loadStudentClassrooms();
    
    // Show success message
    // Successfully joined classroom
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Join Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Classrooms</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Join classrooms using the code provided by your teacher
          </p>
        </div>
        <button
          onClick={() => setShowJoinModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                   text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Join Classroom</span>
        </button>
      </div>

      {/* Enrolled Classrooms */}
      {enrolledClassrooms.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {enrolledClassrooms.map((classroom) => (
            <div
              key={classroom.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 
                       hover:shadow-lg transition-all cursor-pointer"
            >
              {/* Classroom Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {classroom.name}
                    </h3>
                    {classroom.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {classroom.description}
                      </p>
                    )}
                  </div>
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Classroom Stats */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {classroom.students?.length || 0} students
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Joined {formatDate(classroom.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 
                                   text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 
                                   dark:hover:bg-blue-900/30 transition-colors">
                    View Details
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm bg-green-50 dark:bg-green-900/20 
                                   text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 
                                   dark:hover:bg-green-900/30 transition-colors">
                    Take Quiz
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Classrooms Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            You haven't joined any classrooms yet. Ask your teacher for a classroom code to get started.
          </p>
          <button
            onClick={() => setShowJoinModal(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 
                     text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Join Your First Classroom</span>
          </button>
        </div>
      )}

      {/* Recent Activity */}
      {enrolledClassrooms.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {/* Sample activity items */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Completed daily quiz in Biology Class
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    New assignment posted in Plant Science
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Join Classroom Modal */}
      <ClassroomJoinModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        studentId={studentId}
        onSuccess={handleJoinSuccess}
      />
    </div>
  );
};

export default StudentDashboardJoin;
