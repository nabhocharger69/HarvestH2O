import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const RoleSwitcher = ({ 
  currentRole = 'student', 
  availableRoles = ['student', 'teacher'], 
  onRoleChange,
  userName = 'User'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const roleConfig = {
    student: {
      label: 'Student',
      icon: 'GraduationCap',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    teacher: {
      label: 'Teacher',
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    }
  };

  const handleRoleSwitch = (newRole) => {
    if (newRole !== currentRole && onRoleChange) {
      onRoleChange(newRole);
    }
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event?.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isOpen]);

  const currentRoleConfig = roleConfig?.[currentRole];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop Role Switcher */}
      <div className="hidden sm:block">
        <Button
          variant="ghost"
          onClick={toggleDropdown}
          className={`flex items-center space-x-2 px-3 py-2 ${currentRoleConfig?.bgColor} hover:bg-opacity-20 focus-ring`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className={`p-1.5 rounded-full ${currentRoleConfig?.bgColor}`}>
            <Icon 
              name={currentRoleConfig?.icon} 
              size={16} 
              className={currentRoleConfig?.color}
            />
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-foreground">{userName}</div>
            <div className="text-xs text-muted-foreground font-caption">
              {currentRoleConfig?.label}
            </div>
          </div>
          <Icon 
            name={isOpen ? 'ChevronUp' : 'ChevronDown'} 
            size={16} 
            className="text-muted-foreground"
          />
        </Button>
      </div>
      {/* Mobile Role Switcher */}
      <div className="sm:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDropdown}
          className={`${currentRoleConfig?.bgColor} focus-ring`}
          aria-expanded={isOpen}
          aria-haspopup="true"
          title={`Current role: ${currentRoleConfig?.label}`}
        >
          <Icon 
            name={currentRoleConfig?.icon} 
            size={20} 
            className={currentRoleConfig?.color}
          />
        </Button>
      </div>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-modal z-1200 animate-fade-in">
          <div className="py-2">
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground font-caption border-b border-border">
              Switch Role
            </div>
            {availableRoles?.map((role) => {
              const config = roleConfig?.[role];
              const isCurrentRole = role === currentRole;
              
              return (
                <button
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  className={`w-full flex items-center px-3 py-2 text-sm hover:bg-muted focus-ring-inset transition-colors ${
                    isCurrentRole ? 'bg-muted text-foreground' : 'text-muted-foreground'
                  }`}
                  disabled={isCurrentRole}
                >
                  <div className={`p-1.5 rounded-full mr-3 ${config?.bgColor}`}>
                    <Icon 
                      name={config?.icon} 
                      size={14} 
                      className={config?.color}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{config?.label}</div>
                    <div className="text-xs text-muted-foreground font-caption">
                      {role === 'student' ? 'Learning Dashboard' : 'Teaching Dashboard'}
                    </div>
                  </div>
                  {isCurrentRole && (
                    <Icon 
                      name="Check" 
                      size={16} 
                      className="text-success"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;