import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const StudentRosterTable = ({ 
  students = [], 
  onViewProfile, 
  onAddNote, 
  onBulkAction,
  selectedStudents = [],
  onStudentSelect,
  onSelectAll 
}) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Students' },
    { value: 'online', label: 'Online Now' },
    { value: 'recent', label: 'Active Today' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const plantTypeOptions = [
    { value: 'all', label: 'All Plants' },
    { value: 'tomato', label: 'Tomato' },
    { value: 'basil', label: 'Basil' },
    { value: 'lettuce', label: 'Lettuce' },
    { value: 'spinach', label: 'Spinach' },
    { value: 'mint', label: 'Mint' }
  ];

  const [filterPlantType, setFilterPlantType] = useState('all');

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students?.filter(student => {
      const matchesSearch = student?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           student?.rollNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'online' && student?.isOnline) ||
                           (filterStatus === 'recent' && student?.lastSeen === 'Today') ||
                           (filterStatus === 'inactive' && student?.lastSeen !== 'Today' && !student?.isOnline);
      
      const matchesPlantType = filterPlantType === 'all' || student?.plantType === filterPlantType;
      
      return matchesSearch && matchesStatus && matchesPlantType;
    });

    filtered?.sort((a, b) => {
      let aValue = a?.[sortField];
      let bValue = b?.[sortField];
      
      if (sortField === 'xp' || sortField === 'level') {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [students, searchTerm, filterStatus, filterPlantType, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleViewProfile = (studentId) => {
    navigate(`/student-profile?id=${studentId}`);
  };

  const getStatusBadge = (student) => {
    if (student?.isOnline) {
      return (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span className="text-xs text-success font-medium">Online</span>
        </div>
      );
    } else if (student?.lastSeen === 'Today') {
      return (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-warning rounded-full"></div>
          <span className="text-xs text-warning font-medium">Today</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
          <span className="text-xs text-muted-foreground font-medium">{student?.lastSeen}</span>
        </div>
      );
    }
  };

  const getLevelBadge = (level) => {
    const badgeClass = level >= 10 ? 'bg-accent text-accent-foreground' : 
                      level >= 5 ? 'bg-secondary text-secondary-foreground': 'bg-muted text-muted-foreground';
    
    return (
      <span className={`achievement-badge ${badgeClass} flex items-center space-x-1`}>
        <Icon name="Trophy" size={12} />
        <span className="font-bold font-data">L{level}</span>
      </span>
    );
  };

  const allSelected = selectedStudents?.length === filteredAndSortedStudents?.length && filteredAndSortedStudents?.length > 0;
  const someSelected = selectedStudents?.length > 0 && selectedStudents?.length < filteredAndSortedStudents?.length;

  return (
    <div className="bg-card rounded-lg border shadow-card">
      {/* Header with Search and Filters */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search students by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Select
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="Filter by status"
              className="w-full sm:w-40"
            />
            
            <Select
              options={plantTypeOptions}
              value={filterPlantType}
              onChange={setFilterPlantType}
              placeholder="Filter by plant"
              className="w-full sm:w-40"
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedStudents?.length > 0 && (
          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary font-medium">
                {selectedStudents?.length} student{selectedStudents?.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="MessageSquare"
                  onClick={() => onBulkAction('message', selectedStudents)}
                >
                  Send Message
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="FileText"
                  onClick={() => onBulkAction('export', selectedStudents)}
                >
                  Export Data
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                  className="rounded border-border focus:ring-primary"
                />
              </th>
              
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground focus-ring"
                >
                  <span>Student</span>
                  <Icon 
                    name={sortField === 'name' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('rollNumber')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground focus-ring"
                >
                  <span>Roll No.</span>
                  <Icon 
                    name={sortField === 'rollNumber' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-medium text-muted-foreground">Plant Type</span>
              </th>
              
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('level')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground focus-ring"
                >
                  <span>Level</span>
                  <Icon 
                    name={sortField === 'level' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('xp')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground focus-ring"
                >
                  <span>XP</span>
                  <Icon 
                    name={sortField === 'xp' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={14} 
                  />
                </button>
              </th>
              
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
              </th>
              
              <th className="px-6 py-3 text-right">
                <span className="text-sm font-medium text-muted-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border">
            {filteredAndSortedStudents?.map((student) => (
              <tr key={student?.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedStudents?.includes(student?.id)}
                    onChange={(e) => onStudentSelect(student?.id, e?.target?.checked)}
                    className="rounded border-border focus:ring-primary"
                  />
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{student?.name}</div>
                      <div className="text-sm text-muted-foreground font-caption">
                        Joined {student?.joinedDate}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <span className="font-data text-sm">{student?.rollNumber}</span>
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Leaf" size={16} className="text-secondary" />
                    <span className="text-sm capitalize">{student?.plantType}</span>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  {getLevelBadge(student?.level)}
                </td>
                
                <td className="px-6 py-4">
                  <span className="font-data text-sm">{student?.xp?.toLocaleString()}</span>
                </td>
                
                <td className="px-6 py-4">
                  {getStatusBadge(student)}
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => handleViewProfile(student?.id)}
                      title="View Profile"
                    >
                      View
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="FileText"
                      onClick={() => onAddNote(student?.id)}
                      title="Add Note"
                    >
                      Note
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAndSortedStudents?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No students found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== 'all' || filterPlantType !== 'all' ?'Try adjusting your search or filters' :'Students will appear here once they join your classroom'
              }
            </p>
          </div>
        )}
      </div>
      {/* Footer with Results Count */}
      {filteredAndSortedStudents?.length > 0 && (
        <div className="px-6 py-3 border-t border-border bg-muted/20">
          <p className="text-sm text-muted-foreground font-caption">
            Showing {filteredAndSortedStudents?.length} of {students?.length} students
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentRosterTable;