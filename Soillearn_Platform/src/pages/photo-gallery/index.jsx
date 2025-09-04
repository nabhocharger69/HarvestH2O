import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PhotoGallery = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('student');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [filterBy, setFilterBy] = useState('all');
  const [photos, setPhotos] = useState([]);

  // Mock photo data
  const mockPhotos = [
    {
      id: 1,
      date: "2024-11-15",
      url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
      notes: "First day of planting. Seedling looks healthy with good soil preparation.",
      milestone: "germination",
      measurements: { height: 2, leaves: 2 },
      timestamp: "2024-11-15T08:30:00Z"
    },
    {
      id: 2,
      date: "2024-11-22",
      url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop",
      notes: "Great growth this week! First true leaves are developing nicely.",
      milestone: "first_leaves",
      measurements: { height: 8, leaves: 4 },
      timestamp: "2024-11-22T09:15:00Z"
    },
    {
      id: 3,
      date: "2024-11-29",
      url: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&h=300&fit=crop",
      notes: "Significant growth spurt observed. Plant is responding well to current care routine.",
      milestone: "growth_spurt",
      measurements: { height: 15, leaves: 8 },
      timestamp: "2024-11-29T10:00:00Z"
    },
    {
      id: 4,
      date: "2024-12-06",
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      notes: "Strong stem development and healthy leaf color. Excellent progress overall.",
      measurements: { height: 25, leaves: 12 },
      timestamp: "2024-12-06T08:45:00Z"
    },
    {
      id: 5,
      date: "2024-12-13",
      url: "https://images.unsplash.com/photo-1574482620831-29d2c43c4b4e?w=400&h=300&fit=crop",
      notes: "Plant is thriving! Ready for next growth phase with proper support structure.",
      measurements: { height: 35, leaves: 16 },
      timestamp: "2024-12-13T09:30:00Z"
    }
  ];

  useEffect(() => {
    setPhotos(mockPhotos);
  }, []);

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    if (newRole === 'teacher') {
      navigate('/teacher-dashboard');
    }
  };

  const filteredPhotos = photos?.filter(photo => {
    if (filterBy === 'all') return true;
    return photo?.milestone === filterBy;
  });

  const milestones = ['all', 'germination', 'first_leaves', 'growth_spurt'];

  const getMilestoneLabel = (milestone) => {
    const labels = {
      all: 'All Photos',
      germination: 'Germination',
      first_leaves: 'First Leaves',
      growth_spurt: 'Growth Spurts'
    };
    return labels?.[milestone] || milestone;
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole={userRole}
        userName="Student"
        onRoleChange={handleRoleChange}
        onNotificationClick={() => {}}
        onMarkAsRead={() => {}}
        onMarkAllAsRead={() => {}}
        onToggle={() => {}}
      />

      <main className="content-offset px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/student-dashboard')}
                  iconName="ArrowLeft"
                  iconSize={16}
                >
                  Back to Dashboard
                </Button>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Plant Photo Gallery 📸
              </h1>
              <p className="text-muted-foreground">
                View all your uploaded plant growth photos and track progress
              </p>
            </div>

            <Button
              onClick={() => {/* Open photo upload modal */}}
              iconName="Camera"
              iconSize={16}
            >
              Upload Photo
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {milestones?.map((milestone) => (
              <button
                key={milestone}
                onClick={() => setFilterBy(milestone)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterBy === milestone
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-foreground border border-border hover:bg-muted'
                }`}
              >
                {getMilestoneLabel(milestone)}
              </button>
            ))}
          </div>

          {/* Photo Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Photos</p>
                  <p className="text-2xl font-bold text-foreground">{photos?.length}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon name="Camera" size={20} className="text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Days Tracked</p>
                  <p className="text-2xl font-bold text-foreground">28</p>
                </div>
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Icon name="Calendar" size={20} className="text-secondary" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Growth Rate</p>
                  <p className="text-2xl font-bold text-success">+15cm</p>
                </div>
                <div className="p-2 bg-success/10 rounded-lg">
                  <Icon name="TrendingUp" size={20} className="text-success" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Milestones</p>
                  <p className="text-2xl font-bold text-accent">3</p>
                </div>
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Icon name="Award" size={20} className="text-accent" />
                </div>
              </div>
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos?.map((photo) => (
              <div
                key={photo?.id}
                className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => openPhotoModal(photo)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={photo?.url}
                    alt={`Plant photo from ${photo?.date}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      {formatDate(photo?.date)}
                    </span>
                    {photo?.milestone && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {getMilestoneLabel(photo?.milestone)}
                      </span>
                    )}
                  </div>
                  
                  {photo?.measurements && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                      <span>Height: {photo?.measurements?.height}cm</span>
                      <span>Leaves: {photo?.measurements?.leaves}</span>
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {photo?.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredPhotos?.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Camera" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No photos found
              </h3>
              <p className="text-muted-foreground mb-4">
                {filterBy === 'all' ? "You haven't uploaded any photos yet."
                  : `No photos found for ${getMilestoneLabel(filterBy)}.`
                }
              </p>
              <Button onClick={() => {/* Open photo upload modal */}}>
                Upload Your First Photo
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                {formatDate(selectedPhoto?.date)}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closePhotoModal}
                iconName="X"
                iconSize={16}
              />
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={selectedPhoto?.url}
                    alt={`Plant photo from ${selectedPhoto?.date}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-6">
                  {selectedPhoto?.milestone && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Milestone</h4>
                      <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {getMilestoneLabel(selectedPhoto?.milestone)}
                      </span>
                    </div>
                  )}
                  
                  {selectedPhoto?.measurements && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Measurements</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Height</p>
                          <p className="text-lg font-semibold text-foreground">
                            {selectedPhoto?.measurements?.height}cm
                          </p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Leaves</p>
                          <p className="text-lg font-semibold text-foreground">
                            {selectedPhoto?.measurements?.leaves}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedPhoto?.notes}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Uploaded</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedPhoto?.timestamp)?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;