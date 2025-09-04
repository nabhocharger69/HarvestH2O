import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Button from '../../../components/ui/Button';

const ProgressCharts = ({ progressData }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [activeChart, setActiveChart] = useState('xp');

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  const chartTypes = [
    { value: 'xp', label: 'XP Trends', icon: 'TrendingUp' },
    { value: 'tasks', label: 'Task Completion', icon: 'CheckSquare' },
    { value: 'quiz', label: 'Quiz Performance', icon: 'Brain' }
  ];

  const getFilteredData = () => {
    const days = parseInt(selectedTimeRange);
    return progressData?.slice(-days);
  };

  const formatTooltipValue = (value, name) => {
    if (name === 'XP Gained') return [`+${value} XP`, name];
    if (name === 'Tasks Completed') return [`${value} tasks`, name];
    if (name === 'Quiz Score') return [`${value}%`, name];
    return [value, name];
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-md shadow-modal p-3">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry?.color }} />
              {formatTooltipValue(entry?.value, entry?.name)?.[1]}: {formatTooltipValue(entry?.value, entry?.name)?.[0]}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const data = getFilteredData();

    switch (activeChart) {
      case 'xp':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="xpGained"
                stroke="var(--color-secondary)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-secondary)', strokeWidth: 2, r: 4 }}
                name="XP Gained"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'tasks':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="tasksCompleted"
                fill="var(--color-primary)"
                radius={[2, 2, 0, 0]}
                name="Tasks Completed"
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'quiz':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="quizScore"
                stroke="var(--color-accent)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
                name="Quiz Score"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-foreground">Daily Progress Charts</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Chart Type Selector */}
          <div className="flex bg-muted rounded-md p-1">
            {chartTypes?.map((type) => (
              <Button
                key={type?.value}
                variant={activeChart === type?.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveChart(type?.value)}
                iconName={type?.icon}
                iconSize={14}
                className="text-xs"
              >
                {type?.label}
              </Button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div className="flex bg-muted rounded-md p-1">
            {timeRanges?.map((range) => (
              <Button
                key={range?.value}
                variant={selectedTimeRange === range?.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedTimeRange(range?.value)}
                className="text-xs"
              >
                {range?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Chart Container */}
      <div className="w-full h-80">
        {renderChart()}
      </div>
      {/* Chart Summary */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary font-data">
              {progressData?.slice(-parseInt(selectedTimeRange))?.reduce((sum, day) => sum + day?.xpGained, 0)}
            </div>
            <p className="text-sm text-muted-foreground font-caption">Total XP ({selectedTimeRange})</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-primary font-data">
              {progressData?.slice(-parseInt(selectedTimeRange))?.reduce((sum, day) => sum + day?.tasksCompleted, 0)}
            </div>
            <p className="text-sm text-muted-foreground font-caption">Tasks Completed</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-accent font-data">
              {Math.round(progressData?.slice(-parseInt(selectedTimeRange))?.reduce((sum, day) => sum + day?.quizScore, 0) / parseInt(selectedTimeRange))}%
            </div>
            <p className="text-sm text-muted-foreground font-caption">Avg Quiz Score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCharts;