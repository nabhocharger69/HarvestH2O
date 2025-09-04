import React from 'react';
import { Link } from 'react-router-dom';

import RoleBasedNavigation from './RoleBasedNavigation';
import RoleSwitcher from './RoleSwitcher';
import ProgressIndicator from './ProgressIndicator';
import NotificationCenter from './NotificationCenter';

const Header = ({ 
  userRole = 'student',
  userName = 'User',
  userXP = 0,
  userLevel = 1,
  nextLevelXP = 100,
  notifications = [],
  unreadCount = 0,
  onRoleChange,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onToggle // Add this prop for RoleBasedNavigation
}) => {
  // Sample notifications for demo
  const sampleNotifications = notifications?.length > 0 ? notifications : [
    {
      id: 1,
      type: 'quiz_completed',
      title: 'Sarah completed Daily Quiz',
      message: 'Scored 85% on Plant Growth Fundamentals',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false
    },
    {
      id: 2,
      type: 'student_progress',
      title: 'Class average improved',
      message: '3 students reached new levels this week',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false
    },
    {
      id: 3,
      type: 'device_connected',
      title: 'New device connected',
      message: 'Soil sensor #12 is now online',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border shadow-card z-1000">
      <div className="nav-height flex items-center justify-between px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-8">
          <Link 
            to={userRole === 'student' ? '/student-dashboard' : '/teacher-dashboard'}
            className="flex items-center space-x-3 focus-ring rounded-md"
          >
            {/* Logo SVG */}
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary-foreground"
              >
                <path
                  d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                  fill="currentColor"
                />
                <path
                  d="M12 16C12 16 8 18 8 22H16C16 18 12 16 12 16Z"
                  fill="currentColor"
                  fillOpacity="0.7"
                />
              </svg>
            </div>
            
            {/* Brand Name */}
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold font-heading text-foreground">
                SoilLearn
              </h1>
              <p className="text-xs text-muted-foreground font-caption -mt-1">
                Growing Knowledge
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <RoleBasedNavigation userRole={userRole} onToggle={onToggle} />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Student Progress Indicator */}
          {userRole === 'student' && (
            <div className="hidden lg:block">
              <ProgressIndicator
                currentXP={userXP}
                nextLevelXP={nextLevelXP}
                currentLevel={userLevel}
                showDetails={false}
                size="sm"
              />
            </div>
          )}

          {/* Notification Center (Teachers only) */}
          {userRole === 'teacher' && (
            <NotificationCenter
              notifications={sampleNotifications}
              unreadCount={unreadCount || sampleNotifications?.filter(n => !n?.read)?.length}
              onNotificationClick={onNotificationClick}
              onMarkAsRead={onMarkAsRead}
              onMarkAllAsRead={onMarkAllAsRead}
              userRole={userRole}
            />
          )}

          {/* Role Switcher */}
          <RoleSwitcher
            currentRole={userRole}
            availableRoles={['student', 'teacher']}
            onRoleChange={onRoleChange}
            userName={userName}
          />
        </div>
      </div>
      {/* Mobile Progress Indicator for Students */}
      {userRole === 'student' && (
        <div className="lg:hidden px-6 pb-3">
          <ProgressIndicator
            currentXP={userXP}
            nextLevelXP={nextLevelXP}
            currentLevel={userLevel}
            showDetails={true}
            size="sm"
          />
        </div>
      )}
    </header>
  );
};

export default Header;