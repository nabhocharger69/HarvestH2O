import { useState, useEffect } from 'react';
// dataManager will be imported dynamically when needed

export const useStudent = (studentId = null) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (studentId) {
      loadStudent(studentId);
    } else {
      setLoading(false);
    }
  }, [studentId]);

  const loadStudent = async (id) => {
    try {
      setLoading(true);
      const { default: dataManager } = await import('../utils/dataManager');
      const studentData = dataManager.getStudent(id);
      setStudent(studentData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (studentData) => {
    try {
      setLoading(true);
      const { default: dataManager } = await import('../utils/dataManager');
      const newStudent = dataManager.createStudent(studentData);
      setStudent(newStudent);
      setError(null);
      return newStudent;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (updates) => {
    if (!student?.id) {
      setError('No student loaded to update');
      return null;
    }
    
    try {
      setLoading(true);
      const { default: dataManager } = await import('../utils/dataManager');
      const updatedStudent = dataManager.updateStudent(student.id, updates);
      setStudent(updatedStudent);
      setError(null);
      return updatedStudent;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addXP = async (amount, reason = 'Activity completed') => {
    if (!student?.id) return false;
    
    const updatedStudent = {
      ...student,
      xp: (student.xp || 0) + amount,
      lastActivity: new Date().toISOString()
    };
    
    // Log activity
    const { default: dataManager } = await import('../utils/dataManager');
    dataManager.logActivity({
      type: 'xp_gained',
      studentId: student.id,
      amount,
      reason
    });
    
    return updateStudent(updatedStudent);
  };

  const joinClassroom = async (classroomCode) => {
    if (!student?.id) return false;
    
    try {
      const { default: dataManager } = await import('../utils/dataManager');
      const classroom = dataManager.getClassroomByCode(classroomCode);
      if (!classroom) {
        setError('Classroom not found');
        return false;
      }
      
      const success = dataManager.joinClassroom(classroom.id, student.id);
      if (success) {
        dataManager.logActivity({
          type: 'classroom_joined',
          studentId: student.id,
          classroomId: classroom.id,
          classroomName: classroom.name
        });
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    student,
    loading,
    error,
    createStudent,
    updateStudent,
    addXP,
    joinClassroom,
    refresh: () => studentId && loadStudent(studentId)
  };
};
