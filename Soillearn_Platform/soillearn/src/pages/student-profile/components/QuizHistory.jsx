import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuizHistory = ({ quizData }) => {
  const [selectedView, setSelectedView] = useState('performance');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  const viewTypes = [
    { value: 'performance', label: 'Performance', icon: 'TrendingUp' },
    { value: 'categories', label: 'Categories', icon: 'PieChart' },
    { value: 'recent', label: 'Recent Quizzes', icon: 'Clock' }
  ];

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  const categoryColors = [
    'var(--color-primary)',
    'var(--color-secondary)',
    'var(--color-accent)',
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-error)'
  ];

  const getFilteredQuizzes = () => {
    const days = parseInt(selectedTimeRange);
    const cutoffDate = new Date();
    cutoffDate?.setDate(cutoffDate?.getDate() - days);
    
    return quizData?.filter(quiz => new Date(quiz.date) >= cutoffDate);
  };

  const getCategoryData = () => {
    const filteredQuizzes = getFilteredQuizzes();
    const categoryStats = {};
    
    filteredQuizzes?.forEach(quiz => {
      quiz?.categories?.forEach(category => {
        if (!categoryStats?.[category?.name]) {
          categoryStats[category.name] = {
            name: category?.name,
            correct: 0,
            total: 0,
            accuracy: 0
          };
        }
        categoryStats[category.name].correct += category?.correct;
        categoryStats[category.name].total += category?.total;
      });
    });

    return Object.values(categoryStats)?.map(cat => ({
      ...cat,
      accuracy: Math.round((cat?.correct / cat?.total) * 100)
    }));
  };

  const getPerformanceData = () => {
    return getFilteredQuizzes()?.map(quiz => ({
      date: new Date(quiz.date)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: quiz?.score,
      accuracy: quiz?.accuracy,
      xpGained: quiz?.xpGained
    }));
  };

  const getScoreDistribution = () => {
    const filteredQuizzes = getFilteredQuizzes();
    const ranges = [
      { range: '90-100%', min: 90, max: 100, count: 0, color: 'var(--color-success)' },
      { range: '80-89%', min: 80, max: 89, count: 0, color: 'var(--color-secondary)' },
      { range: '70-79%', min: 70, max: 79, count: 0, color: 'var(--color-accent)' },
      { range: '60-69%', min: 60, max: 69, count: 0, color: 'var(--color-warning)' },
      { range: 'Below 60%', min: 0, max: 59, count: 0, color: 'var(--color-error)' }
    ];

    filteredQuizzes?.forEach(quiz => {
      const range = ranges?.find(r => quiz?.score >= r?.min && quiz?.score <= r?.max);
      if (range) range.count++;
    });

    return ranges?.filter(r => r?.count > 0);
  };

  const getAverageScore = () => {
    const filteredQuizzes = getFilteredQuizzes();
    if (filteredQuizzes?.length === 0) return 0;
    return Math.round(filteredQuizzes?.reduce((sum, quiz) => sum + quiz?.score, 0) / filteredQuizzes?.length);
  };

  const getImprovementTrend = () => {
    const filteredQuizzes = getFilteredQuizzes();
    if (filteredQuizzes?.length < 2) return 0;
    
    const recent = filteredQuizzes?.slice(-5);
    const older = filteredQuizzes?.slice(-10, -5);
    
    const recentAvg = recent?.reduce((sum, quiz) => sum + quiz?.score, 0) / recent?.length;
    const olderAvg = older?.length > 0 ? older?.reduce((sum, quiz) => sum + quiz?.score, 0) / older?.length : recentAvg;
    
    return Math.round(recentAvg - olderAvg);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-md shadow-modal p-3">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry?.color }} />
              {entry?.name}: {entry?.value}{entry?.name === 'Score' || entry?.name === 'Accuracy' ? '%' : entry?.name === 'XP Gained' ? ' XP' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderContent = () => {
    switch (selectedView) {
      case 'performance':
        return (
          <div className="space-y-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getPerformanceData()}>
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
                  <Bar
                    dataKey="score"
                    fill="var(--color-primary)"
                    radius={[2, 2, 0, 0]}
                    name="Score"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Score Distribution</h4>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getScoreDistribution()}
                        dataKey="count"
                        nameKey="range"
                        cx="50%"
                        cy="50%"
                        outerRadius={50}
                        label={({ range, count }) => `${range}: ${count}`}
                        labelLine={false}
                        fontSize={10}
                      >
                        {getScoreDistribution()?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry?.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-foreground mb-4">Performance Insights</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Score:</span>
                    <span className="text-sm font-medium text-foreground">{getAverageScore()}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Improvement:</span>
                    <span className={`text-sm font-medium ${getImprovementTrend() >= 0 ? 'text-success' : 'text-error'}`}>
                      {getImprovementTrend() >= 0 ? '+' : ''}{getImprovementTrend()}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Quizzes:</span>
                    <span className="text-sm font-medium text-foreground">{getFilteredQuizzes()?.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'categories':
        return (
          <div className="space-y-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getCategoryData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="accuracy"
                    fill="var(--color-secondary)"
                    radius={[2, 2, 0, 0]}
                    name="Accuracy"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {getCategoryData()?.map((category, index) => (
                <div key={category?.name} className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">{category?.name}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Accuracy:</span>
                      <span className="font-medium text-foreground">{category?.accuracy}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Questions:</span>
                      <span className="font-medium text-foreground">{category?.correct}/{category?.total}</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div 
                        className="bg-secondary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${category?.accuracy}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'recent':
        return (
          <div className="space-y-4">
            {getFilteredQuizzes()?.slice(-10)?.reverse()?.map((quiz) => (
              <div key={quiz?.id} className="p-4 bg-muted rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      quiz?.score >= 80 ? 'bg-success text-success-foreground' :
                      quiz?.score >= 60 ? 'bg-warning text-warning-foreground': 'bg-error text-error-foreground'
                    }`}>
                      <span className="font-bold font-data">{quiz?.score}%</span>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {new Date(quiz.date)?.toLocaleDateString('en-US', { 
                          weekday: 'long',
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {quiz?.questionsCorrect}/{quiz?.totalQuestions} questions correct
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        +{quiz?.xpGained} XP
                      </div>
                      <div className="text-xs text-muted-foreground font-caption">
                        {quiz?.timeTaken} minutes
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" iconName="Eye" iconSize={14}>
                      Review
                    </Button>
                  </div>
                </div>
                
                {quiz?.weakAreas && quiz?.weakAreas?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Areas for improvement:</p>
                    <div className="flex flex-wrap gap-1">
                      {quiz?.weakAreas?.map((area, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-error/10 text-error text-xs rounded-md"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-foreground">Quiz Performance History</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* View Type Selector */}
          <div className="flex bg-muted rounded-md p-1">
            {viewTypes?.map((type) => (
              <Button
                key={type?.value}
                variant={selectedView === type?.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedView(type?.value)}
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
      {renderContent()}
      {/* Knowledge Gap Analysis */}
      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Knowledge Gap Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-error/5 border border-error/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="AlertTriangle" size={16} className="text-error" />
              <h4 className="font-semibold text-error">Areas Needing Attention</h4>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Soil pH and nutrient balance</li>
              <li>• Plant disease identification</li>
              <li>• Watering frequency optimization</li>
            </ul>
          </div>
          
          <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <h4 className="font-semibold text-success">Strong Knowledge Areas</h4>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Plant growth stages</li>
              <li>• Basic soil composition</li>
              <li>• Light requirements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizHistory;