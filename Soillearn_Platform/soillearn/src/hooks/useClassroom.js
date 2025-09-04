import { useState, useEffect } from 'react';
// dataManager will be imported dynamically when needed

export const useClassroom = (classroomId = null) => {
  const [classroom, setClassroom] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (classroomId) {
      loadClassroom(classroomId);
    } else {
      setLoading(false);
    }
  }, [classroomId]);

  const loadClassroom = async (id) => {
    try {
      setLoading(true);
      const { default: dataManager } = await import('../utils/dataManager');
      const classroomData = dataManager.getClassroom(id);
      setClassroom(classroomData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTeacherClassrooms = async (teacherId) => {
    try {
      setLoading(true);
      const { default: dataManager } = await import('../utils/dataManager');
      const teacherClassrooms = dataManager.getTeacherClassrooms(teacherId);
      setClassrooms(teacherClassrooms);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createClassroom = async (classroomData) => {
    try {
      setLoading(true);
      const { default: dataManager } = await import('../utils/dataManager');
      const newClassroom = dataManager.createClassroom(classroomData);
      setClassroom(newClassroom);
      setError(null);
      
      // Log activity
      dataManager.logActivity({
        type: 'classroom_created',
        teacherId: classroomData.teacherId,
        classroomId: newClassroom.id,
        classroomName: newClassroom.name
      });
      
      return newClassroom;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const findClassroomByCode = async (code) => {
    try {
      const { default: dataManager } = await import('../utils/dataManager');
      const foundClassroom = dataManager.getClassroomByCode(code);
      return foundClassroom;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const addStudent = async (studentId) => {
    if (!classroom?.id) return false;
    
    try {
      const { default: dataManager } = await import('../utils/dataManager');
      const success = dataManager.joinClassroom(classroom.id, studentId);
      if (success) {
        // Refresh classroom data
        await loadClassroom(classroom.id);
        
        dataManager.logActivity({
          type: 'student_joined',
          classroomId: classroom.id,
          studentId,
          timestamp: new Date().toISOString()
        });
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const removeStudent = async (studentId) => {
    if (!classroom?.id) return false;
    
    try {
      const { default: dataManager } = await import('../utils/dataManager');
      const success = dataManager.leaveClassroom(classroom.id, studentId);
      if (success) {
        // Refresh classroom data
        await loadClassroom(classroom.id);
        
        dataManager.logActivity({
          type: 'student_left',
          classroomId: classroom.id,
          studentId,
          timestamp: new Date().toISOString()
        });
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const regenerateCode = async () => {
    if (!classroom?.id) return null;
    
    try {
      const { default: dataManager } = await import('../utils/dataManager');
      const newCode = dataManager.regenerateClassroomCode(classroom.id);
      if (newCode) {
        // Refresh classroom data
        await loadClassroom(classroom.id);
        
        dataManager.logActivity({
          type: 'code_regenerated',
          classroomId: classroom.id,
          newCode,
          timestamp: new Date().toISOString()
        });
        return newCode;
      }
      return null;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const getStudents = async () => {
    if (!classroom?.students) return [];
    
    try {
      const { default: dataManager } = await import('../utils/dataManager');
      return classroom.students.map(studentId => {
        return dataManager.getStudent(studentId);
      }).filter(Boolean);
    } catch (err) {
      console.error('Error getting students:', err);
      return [];
    }
  };

  return {
    classroom,
    classrooms,
    loading,
    error,
    createClassroom,
    findClassroomByCode,
    addStudentToClassroom,
    removeStudentFromClassroom,
    regenerateCode,
    getClassroomStudents,
    loadTeacherClassrooms,
    refresh: () => classroomId && loadClassroom(classroomId)
  };
};
