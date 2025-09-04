import React, { useState, useEffect } from 'react';
import { Users, Calendar, Hash, Settings, Archive, Copy, Check, Download, FileSpreadsheet } from 'lucide-react';
// dataManager will be imported dynamically when needed

// Student preview component to avoid direct dataManager calls in render
const StudentPreview = ({ studentId }) => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const { default: dataManager } = await import('../../utils/dataManager');
        const studentData = dataManager.getStudent(studentId);
        setStudent(studentData);
      } catch (error) {
        console.error('Error loading student:', error);
      }
    };
    loadStudent();
  }, [studentId]);

  if (!student) return null;

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
          {student.name?.charAt(0)?.toUpperCase()}
        </span>
      </div>
      <span className="text-gray-700 dark:text-gray-300">{student.name}</span>
      <span className="text-gray-400 text-xs">Level {student.level || 1}</span>
    </div>
  );
};

const ClassroomCard = ({ classroom, onUpdate, showActions = true }) => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Listen for student profile updates to refresh classroom data
  useEffect(() => {
    const handleStudentProfileUpdate = (event) => {
      const { studentId, updatedData } = event.detail;
      // Check if this student is in our classroom
      if (classroom.students && classroom.students.includes(studentId)) {
        // Trigger a refresh of classroom data
        if (onUpdate) {
          onUpdate();
        }
      }
    };

    window.addEventListener('studentProfileUpdated', handleStudentProfileUpdate);
    return () => {
      window.removeEventListener('studentProfileUpdated', handleStudentProfileUpdate);
    };
  }, [classroom.students, onUpdate]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(classroom.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleRegenerateCode = async () => {
    if (!confirm('Are you sure you want to regenerate the classroom code? Students will need the new code to join.')) {
      return;
    }

    setLoading(true);
    try {
      const { default: dataManager } = await import('../../utils/dataManager');
      const newCode = dataManager.regenerateClassroomCode(classroom.id);
      if (newCode) {
        onUpdate && onUpdate({ ...classroom, code: newCode });
      }
    } catch (error) {
      console.error('Error regenerating code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!window.confirm(`Are you sure you want to archive "${classroom.name}"? This action can be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const { default: dataManager } = await import('../../utils/dataManager');
      const result = dataManager.archiveClassroom(classroom.id);
      if (result.success) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error archiving classroom:', error);
      alert('Failed to archive classroom. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setLoading(true);
    try {
      const { default: dataManager } = await import('../../utils/dataManager');
      const result = dataManager.exportClassroomCSV(classroom.id);
      if (result.success) {
        // Show success message with details
        alert(`CSV exported successfully!\nFile: ${result.filename}\nStudents: ${result.recordCount.students}\nActivities: ${result.recordCount.activities}`);
      } else {
        alert('Failed to export CSV: ' + result.error);
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportXLSX = async () => {
    setLoading(true);
    try {
      const { default: dataManager } = await import('../../utils/dataManager');
      const result = await dataManager.exportClassroomXLSX(classroom.id);
      if (result.success) {
        // Show success message with details
        alert(`Excel file exported successfully!\nFile: ${result.fileName}\nStudents: ${result.recordCount}\nSheets: ${result.sheets.join(', ')}`);
      } else {
        alert(`Export failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error exporting XLSX:', error);
      alert('Failed to export Excel file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 
                    ${!classroom.isActive ? 'opacity-60' : ''} transition-all hover:shadow-lg`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {classroom.name}
              {!classroom.isActive && (
                <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                  Archived
                </span>
              )}
            </h3>
            {classroom.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {classroom.description}
              </p>
            )}
            
            {/* Classroom Code */}
            <div className="flex items-center space-x-2 mb-2">
              <Hash className="w-4 h-4 text-gray-400" />
              <code className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-blue-600 dark:text-blue-400">
                {classroom.code}
              </code>
              <button
                onClick={handleCopyCode}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Copy classroom code"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{classroom.students?.length || 0} students</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Created {formatDate(classroom.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {showActions && classroom.isActive && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportCSV}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                title="Export classroom data as CSV"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handleExportXLSX}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                title="Export classroom data as Excel (XLSX)"
              >
                <FileSpreadsheet className="w-4 h-4" />
              </button>
              <button
                onClick={handleRegenerateCode}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="Regenerate classroom code"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={handleArchive}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Archive classroom"
              >
                <Archive className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Student List Preview */}
      {classroom.students?.length > 0 && (
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Recent Students
          </h4>
          <div className="space-y-2">
            {classroom.students.slice(0, 3).map(studentId => (
              <StudentPreview key={studentId} studentId={studentId} />
            ))}
            {classroom.students.length > 3 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 pl-8">
                +{classroom.students.length - 3} more students
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!classroom.students || classroom.students.length === 0) && (
        <div className="p-6 text-center">
          <Users className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No students have joined yet
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Share the classroom code: <strong>{classroom.code}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default ClassroomCard;
