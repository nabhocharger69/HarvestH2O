import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PhotoTimeline = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'gallery'

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysFromStart = (dateString) => {
    const startDate = new Date(photos[0]?.date);
    const currentDate = new Date(dateString);
    const diffTime = Math.abs(currentDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getMilestoneIcon = (milestone) => {
    switch (milestone) {
      case 'germination': return 'Sprout';
      case 'first_leaves': return 'Leaf';
      case 'growth_spurt': return 'TrendingUp';
      case 'flowering': return 'Flower';
      case 'fruiting': return 'Apple';
      default: return 'Camera';
    }
  };

  const getMilestoneColor = (milestone) => {
    switch (milestone) {
      case 'germination': return 'text-success';
      case 'first_leaves': return 'text-secondary';
      case 'growth_spurt': return 'text-primary';
      case 'flowering': return 'text-accent';
      case 'fruiting': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const PhotoModal = ({ photo, onClose }) => {
    if (!photo) return null;

    return (
      <div className="fixed inset-0 bg-black/80 z-1300 flex items-center justify-center p-4">
        <div className="bg-card rounded-lg shadow-modal max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Day {getDaysFromStart(photo?.date)} - {formatDate(photo?.date)}
              </h3>
              {photo?.milestone && (
                <div className="flex items-center gap-2 mt-1">
                  <Icon 
                    name={getMilestoneIcon(photo?.milestone)} 
                    size={16} 
                    className={getMilestoneColor(photo?.milestone)} 
                  />
                  <span className="text-sm text-muted-foreground capitalize">
                    {photo?.milestone?.replace('_', ' ')}
                  </span>
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
          
          <div className="p-4">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <Image
                  src={photo?.url}
                  alt={`Plant photo from ${formatDate(photo?.date)}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              
              <div className="lg:w-80">
                <h4 className="font-semibold text-foreground mb-3">Growth Notes</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {photo?.notes || "No notes recorded for this day."}
                </p>
                
                {photo?.measurements && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Measurements</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold text-foreground font-data">
                          {photo?.measurements?.height}cm
                        </div>
                        <div className="text-xs text-muted-foreground font-caption">Height</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold text-foreground font-data">
                          {photo?.measurements?.leaves}
                        </div>
                        <div className="text-xs text-muted-foreground font-caption">Leaves</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-foreground">Plant Growth Timeline</h2>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-md p-1">
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('timeline')}
              iconName="Clock"
              iconSize={14}
              className="text-xs"
            >
              Timeline
            </Button>
            <Button
              variant={viewMode === 'gallery' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('gallery')}
              iconName="Grid"
              iconSize={14}
              className="text-xs"
            >
              Gallery
            </Button>
          </div>
        </div>
      </div>
      {viewMode === 'timeline' ? (
        /* Timeline View */
        (<div className="space-y-6">
          {photos?.map((photo, index) => (
            <div key={photo?.id} className="flex gap-4">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full border-2 border-border bg-card flex items-center justify-center ${
                  photo?.milestone ? getMilestoneColor(photo?.milestone) : 'text-muted-foreground'
                }`}>
                  <Icon 
                    name={photo?.milestone ? getMilestoneIcon(photo?.milestone) : 'Camera'} 
                    size={16} 
                  />
                </div>
                {index < photos?.length - 1 && (
                  <div className="w-0.5 h-16 bg-border mt-2" />
                )}
              </div>

              {/* Photo Content */}
              <div className="flex-1 pb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div 
                    className="cursor-pointer group"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <Image
                      src={photo?.url}
                      alt={`Plant photo from day ${getDaysFromStart(photo?.date)}`}
                      className="w-32 h-32 object-cover rounded-lg border border-border group-hover:border-primary transition-colors"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        Day {getDaysFromStart(photo?.date)}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(photo?.date)}
                      </span>
                      {photo?.milestone && (
                        <div className="achievement-badge achievement-gold">
                          <Icon name={getMilestoneIcon(photo?.milestone)} size={12} />
                          <span className="text-xs capitalize ml-1">
                            {photo?.milestone?.replace('_', ' ')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {photo?.notes || "Daily growth documentation"}
                    </p>
                    
                    {photo?.measurements && (
                      <div className="flex gap-4">
                        <div className="text-xs text-muted-foreground">
                          <Icon name="Ruler" size={12} className="inline mr-1" />
                          Height: {photo?.measurements?.height}cm
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <Icon name="Leaf" size={12} className="inline mr-1" />
                          Leaves: {photo?.measurements?.leaves}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>)
      ) : (
        /* Gallery View */
        (<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {photos?.map((photo) => (
            <div
              key={photo?.id}
              className="relative cursor-pointer group"
              onClick={() => setSelectedPhoto(photo)}
            >
              <Image
                src={photo?.url}
                alt={`Plant photo from day ${getDaysFromStart(photo?.date)}`}
                className="w-full h-24 object-cover rounded-lg border border-border group-hover:border-primary transition-colors"
              />
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
              
              <div className="absolute bottom-1 left-1 right-1">
                <div className="bg-black/70 text-white text-xs px-2 py-1 rounded text-center font-caption">
                  Day {getDaysFromStart(photo?.date)}
                </div>
              </div>
              
              {photo?.milestone && (
                <div className="absolute top-1 right-1">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <Icon 
                      name={getMilestoneIcon(photo?.milestone)} 
                      size={12} 
                      className="text-accent-foreground" 
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>)
      )}
      {/* Growth Summary */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground font-data">
              {photos?.length}
            </div>
            <p className="text-sm text-muted-foreground font-caption">Photos Captured</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary font-data">
              {getDaysFromStart(photos?.[photos?.length - 1]?.date)}
            </div>
            <p className="text-sm text-muted-foreground font-caption">Days Growing</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-accent font-data">
              {photos?.filter(p => p?.milestone)?.length}
            </div>
            <p className="text-sm text-muted-foreground font-caption">Milestones Reached</p>
          </div>
        </div>
      </div>
      {/* Photo Modal */}
      <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </div>
  );
};

export default PhotoTimeline;