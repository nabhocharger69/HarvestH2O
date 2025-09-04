import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const TeacherNotes = ({ studentId, notes, onAddNote, onUpdateNote, onDeleteNote }) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('general');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = [
    { value: 'general', label: 'General', icon: 'FileText', color: 'text-muted-foreground' },
    { value: 'academic', label: 'Academic', icon: 'BookOpen', color: 'text-primary' },
    { value: 'behavioral', label: 'Behavioral', icon: 'Users', color: 'text-secondary' },
    { value: 'intervention', label: 'Intervention', icon: 'AlertTriangle', color: 'text-warning' },
    { value: 'achievement', label: 'Achievement', icon: 'Award', color: 'text-success' },
    { value: 'parent_contact', label: 'Parent Contact', icon: 'Phone', color: 'text-accent' }
  ];

  const handleAddNote = () => {
    if (newNoteContent?.trim()) {
      const note = {
        id: Date.now(),
        content: newNoteContent,
        category: newNoteCategory,
        timestamp: new Date()?.toISOString(),
        teacherName: 'Current Teacher' // This would come from auth context
      };
      
      if (onAddNote) {
        onAddNote(note);
      }
      
      setNewNoteContent('');
      setNewNoteCategory('general');
      setIsAddingNote(false);
    }
  };

  const handleEditNote = (noteId, newContent) => {
    if (onUpdateNote) {
      onUpdateNote(noteId, { content: newContent, lastModified: new Date()?.toISOString() });
    }
    setEditingNoteId(null);
  };

  const handleDeleteNote = (noteId) => {
    if (onDeleteNote && window.confirm('Are you sure you want to delete this note?')) {
      onDeleteNote(noteId);
    }
  };

  const getCategoryConfig = (categoryValue) => {
    return categories?.find(cat => cat?.value === categoryValue) || categories?.[0];
  };

  const getFilteredNotes = () => {
    if (filterCategory === 'all') return notes;
    return notes?.filter(note => note?.category === filterCategory);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const EditableNote = ({ note }) => {
    const [editContent, setEditContent] = useState(note?.content);
    const isEditing = editingNoteId === note?.id;

    if (isEditing) {
      return (
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e?.target?.value)}
            className="w-full p-3 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            rows={3}
            placeholder="Enter note content..."
          />
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => handleEditNote(note?.id, editContent)}
              iconName="Check"
              iconSize={14}
            >
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingNoteId(null)}
              iconName="X"
              iconSize={14}
            >
              Cancel
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <p className="text-sm text-foreground leading-relaxed">{note?.content}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-caption">
            <span>{note?.teacherName}</span>
            <span>{formatDate(note?.timestamp)}</span>
            {note?.lastModified && (
              <span className="italic">Edited {formatDate(note?.lastModified)}</span>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingNoteId(note?.id)}
              iconName="Edit"
              iconSize={14}
              className="text-xs"
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteNote(note?.id)}
              iconName="Trash2"
              iconSize={14}
              className="text-xs text-error hover:text-error"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-foreground">Teacher Notes</h2>
        
        <div className="flex items-center gap-3">
          {/* Category Filter */}
          <div className="flex bg-muted rounded-md p-1">
            <Button
              variant={filterCategory === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilterCategory('all')}
              className="text-xs"
            >
              All
            </Button>
            {categories?.slice(0, 3)?.map((category) => (
              <Button
                key={category?.value}
                variant={filterCategory === category?.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilterCategory(category?.value)}
                iconName={category?.icon}
                iconSize={14}
                className="text-xs"
              >
                {category?.label}
              </Button>
            ))}
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={() => setIsAddingNote(true)}
            iconName="Plus"
            iconSize={14}
          >
            Add Note
          </Button>
        </div>
      </div>
      {/* Add New Note Form */}
      {isAddingNote && (
        <div className="mb-6 p-4 bg-muted rounded-lg border border-border">
          <h3 className="font-semibold text-foreground mb-3">Add New Note</h3>
          
          <div className="space-y-4">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories?.map((category) => (
                  <button
                    key={category?.value}
                    onClick={() => setNewNoteCategory(category?.value)}
                    className={`p-2 rounded-md border text-left transition-colors ${
                      newNoteCategory === category?.value
                        ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-muted-foreground/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon name={category?.icon} size={14} className={category?.color} />
                      <span className="text-xs font-medium">{category?.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Note Content */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Note Content</label>
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e?.target?.value)}
                className="w-full p-3 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                rows={4}
                placeholder="Enter detailed notes about the student's progress, behavior, or any observations..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="default"
                onClick={handleAddNote}
                iconName="Save"
                iconSize={14}
                disabled={!newNoteContent?.trim()}
              >
                Save Note
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNoteContent('');
                  setNewNoteCategory('general');
                }}
                iconName="X"
                iconSize={14}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Notes List */}
      <div className="space-y-4">
        {getFilteredNotes()?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="FileText" size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {filterCategory === 'all' ? 'No notes recorded yet' : `No ${getCategoryConfig(filterCategory)?.label?.toLowerCase()} notes found`}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingNote(true)}
              className="mt-2"
            >
              Add the first note
            </Button>
          </div>
        ) : (
          getFilteredNotes()?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))?.map((note) => {
              const categoryConfig = getCategoryConfig(note?.category);
              
              return (
                <div key={note?.id} className="p-4 bg-muted rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name={categoryConfig?.icon} size={16} className={categoryConfig?.color} />
                    <span className={`text-sm font-medium ${categoryConfig?.color}`}>
                      {categoryConfig?.label}
                    </span>
                  </div>
                  <EditableNote note={note} />
                </div>
              );
            })
        )}
      </div>
      {/* Notes Summary */}
      {notes?.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Notes Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories?.map((category) => {
              const count = notes?.filter(note => note?.category === category?.value)?.length;
              return (
                <div key={category?.value} className="text-center p-3 bg-muted rounded-lg">
                  <Icon name={category?.icon} size={16} className={`${category?.color} mx-auto mb-1`} />
                  <div className="text-lg font-bold text-foreground font-data">{count}</div>
                  <div className="text-xs text-muted-foreground font-caption">{category?.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherNotes;