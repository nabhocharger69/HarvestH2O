import React, { createContext, useContext, useState, useEffect } from 'react';
// dataManager will be imported dynamically when needed

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        // Initialize theme from dataManager
        const { default: dataManager } = await import('../utils/dataManager');
        const settings = dataManager.getSettings();
        if (settings && settings.theme) {
          setTheme(settings.theme);
        }
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', settings?.theme || 'light');
        setLoading(false);
      } catch (error) {
        console.error('Error initializing theme:', error);
        // Fallback to light theme
        setTheme('light');
        document.documentElement.setAttribute('data-theme', 'light');
        setLoading(false);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      
      // Update in dataManager
      const { default: dataManager } = await import('../utils/dataManager');
      dataManager.updateSettings({ theme: newTheme });
      
      // Apply to document
      document.documentElement.setAttribute('data-theme', newTheme);
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  const setThemeMode = async (mode) => {
    try {
      if (mode === 'light' || mode === 'dark') {
        setTheme(mode);
        const { default: dataManager } = await import('../utils/dataManager');
        dataManager.updateSettings({ theme: mode });
        document.documentElement.setAttribute('data-theme', mode);
      }
    } catch (error) {
      console.error('Error setting theme mode:', error);
    }
  };

  const value = {
    theme,
    toggleTheme,
    setTheme: setThemeMode,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
