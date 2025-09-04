import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const SearchAndFilters = ({ 
  onSearch, 
  onFilterChange, 
  onViewModeChange, 
  viewMode = 'grid',
  totalClassrooms = 0 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    activity: 'all',
    engagement: 'all',
    completion: 'all'
  });

  const activityOptions = [
    { value: 'all', label: 'All Activity Levels' },
    { value: 'high', label: 'High Activity' },
    { value: 'medium', label: 'Medium Activity' },
    { value: 'low', label: 'Low Activity' }
  ];

  const engagementOptions = [
    { value: 'all', label: 'All Engagement' },
    { value: 'high', label: 'High Engagement (80%+)' },
    { value: 'medium', label: 'Medium Engagement (50-79%)' },
    { value: 'low', label: 'Low Engagement (<50%)' }
  ];

  const completionOptions = [
    { value: 'all', label: 'All Completion Rates' },
    { value: 'high', label: 'High Completion (80%+)' },
    { value: 'medium', label: 'Medium Completion (50-79%)' },
    { value: 'low', label: 'Low Completion (<50%)' }
  ];

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...activeFilters,
      [filterType]: value
    };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const resetFilters = {
      activity: 'all',
      engagement: 'all',
      completion: 'all'
    };
    setActiveFilters(resetFilters);
    setSearchTerm('');
    onFilterChange(resetFilters);
    onSearch('');
  };

  const hasActiveFilters = Object.values(activeFilters)?.some(value => value !== 'all') || searchTerm;

  return (
    <div className="space-y-4">
      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search classrooms..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>

        <div className="flex items-center space-x-2">
          {/* Results Count */}
          <span className="text-sm text-muted-foreground mr-4">
            {totalClassrooms} classroom{totalClassrooms !== 1 ? 's' : ''}
          </span>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="px-3"
            >
              <Icon name="Grid3X3" size={16} />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="px-3"
            >
              <Icon name="List" size={16} />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <Select
            placeholder="Activity Level"
            options={activityOptions}
            value={activeFilters?.activity}
            onChange={(value) => handleFilterChange('activity', value)}
            className="w-full sm:w-48"
          />

          <Select
            placeholder="Engagement"
            options={engagementOptions}
            value={activeFilters?.engagement}
            onChange={(value) => handleFilterChange('engagement', value)}
            className="w-full sm:w-48"
          />

          <Select
            placeholder="Completion Rate"
            options={completionOptions}
            value={activeFilters?.completion}
            onChange={(value) => handleFilterChange('completion', value)}
            className="w-full sm:w-48"
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilters;