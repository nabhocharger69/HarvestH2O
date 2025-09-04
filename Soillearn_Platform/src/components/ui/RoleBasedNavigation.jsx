import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const RoleBasedNavigation = ({ userRole = 'student', isCollapsed = false, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const studentNavItems = [
    {
      path: '/student-dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      description: 'View your progress and activities'
    },
    {
      path: '/daily-quiz',
      label: 'Daily Quiz',
      icon: 'Brain',
      description: 'Take your daily learning quiz'
    },
    {
      path: '/device-connection',
      label: 'My Device',
      icon: 'Smartphone',
      description: 'Connect and manage your IoT device'
    }
  ];

  const teacherNavItems = [
    {
      path: '/teacher-dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      description: 'Overview of all classrooms'
    },
    {
      path: '/classroom-management',
      label: 'Classrooms',
      icon: 'Users',
      description: 'Manage your classrooms'
    },
    {
      path: '/student-profile',
      label: 'Students',
      icon: 'UserCheck',
      description: 'View student profiles and progress'
    }
  ];

  const navigationItems = userRole === 'student' ? studentNavItems : teacherNavItems;

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-nav">
        {navigationItems?.map((item) => (
          <button
            key={item?.path}
            onClick={() => handleNavigation(item?.path)}
            className={`nav-item focus-ring ${
              isActiveRoute(item?.path) ? 'nav-item-active' : 'nav-item-inactive'
            }`}
            title={item?.description}
          >
            <Icon 
              name={item?.icon} 
              size={18} 
              className="mr-2" 
            />
            <span className="font-medium">{item?.label}</span>
          </button>
        ))}
      </nav>
      {/* Mobile Navigation Toggle */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
          className="focus-ring"
          aria-label="Toggle navigation menu"
        >
          <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
        </Button>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-card border-t border-border shadow-modal z-1100 md:hidden">
          <div className="px-4 py-2 space-nav-mobile">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`nav-item w-full justify-start focus-ring ${
                  isActiveRoute(item?.path) ? 'nav-item-active' : 'nav-item-inactive'
                }`}
              >
                <Icon 
                  name={item?.icon} 
                  size={20} 
                  className="mr-3" 
                />
                <div className="text-left">
                  <div className="font-medium">{item?.label}</div>
                  <div className="text-xs text-muted-foreground font-caption">
                    {item?.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-1000 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default RoleBasedNavigation;