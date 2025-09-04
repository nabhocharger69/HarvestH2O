import React, { useState } from 'react';
import { X, Users, Hash } from 'lucide-react';

const ClassroomJoinModal = ({ isOpen, onClose, studentId, onSuccess }) => {
  const [classroomCode, setClassroomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoinClassroom = async (e) => {
    e.preventDefault();
    
    if (!classroomCode.trim()) {
      setError('Please enter a classroom code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const dataManager = await import('../../utils/dataManager');
      const dm = dataManager.default;
      
      const result = dm.joinClassroomByCode(studentId, classroomCode.toUpperCase());
      
      if (result.success) {
        onSuccess && onSuccess(result.classroom);
        setClassroomCode('');
        onClose();
      } else {
        setError(result.error || 'Failed to join classroom');
      }
    } catch (err) {
      setError('An error occurred while joining the classroom');
    } finally {
      setLoading(false);
    }
  };

  const formatClassroomCode = (value) => {
    // Remove non-alphanumeric characters and convert to uppercase
    const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    
    // Format as ABC123 (3 letters + 3 numbers)
    if (cleaned.length <= 3) {
      return cleaned;
    } else {
      return cleaned.slice(0, 3) + cleaned.slice(3, 6);
    }
  };

  const handleCodeChange = (e) => {
    const formatted = formatClassroomCode(e.target.value);
    setClassroomCode(formatted);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Join Classroom
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter the classroom code to join
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleJoinClassroom} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Classroom Code
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={classroomCode}
                  onChange={handleCodeChange}
                  placeholder="ABC123"
                  maxLength={6}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder-gray-400 dark:placeholder-gray-500
                           text-center text-lg font-mono tracking-wider"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Format: 3 letters followed by 3 numbers (e.g., ABC123)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                <strong>How to get a classroom code:</strong>
                <br />
                Ask your teacher for the 6-character classroom code. It looks like "ABC123".
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 
                       hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !classroomCode.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 
                       text-white rounded-lg transition-colors disabled:cursor-not-allowed
                       flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  <span>Join Classroom</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassroomJoinModal;
