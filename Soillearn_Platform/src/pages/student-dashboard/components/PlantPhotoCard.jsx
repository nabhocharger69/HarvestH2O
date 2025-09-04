import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PlantPhotoCard = () => {
  const [todayPhotoUploaded, setTodayPhotoUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const recentPhotos = [
    {
      id: 1,
      date: "2025-01-02",
      url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
      day: 15,
      notes: "New leaf sprouting!"
    },
    {
      id: 2,
      date: "2025-01-01",
      url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=400&fit=crop",
      day: 14,
      notes: "Growing taller"
    },
    {
      id: 3,
      date: "2024-12-31",
      url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
      day: 13,
      notes: "Healthy growth"
    },
    {
      id: 4,
      date: "2024-12-30",
      url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=400&fit=crop",
      day: 12,
      notes: "First flowers appearing"
    }
  ];

  const handlePhotoUpload = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setTodayPhotoUploaded(true);
      setIsUploading(false);
      // Trigger XP gain animation
      // Photo uploaded! +10 XP
    }, 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCurrentDay = () => {
    return recentPhotos?.length > 0 ? recentPhotos?.[0]?.day + 1 : 1;
  };

  return (
    <div className="card-elevated p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Plant Progress</h2>
          <p className="text-sm text-muted-foreground font-caption">
            Document your plant's daily growth
          </p>
        </div>
        
        {/* Day Counter */}
        <div className="text-center">
          <div className="text-lg font-bold font-data text-primary">
            Day {getCurrentDay()}
          </div>
          <p className="text-xs text-muted-foreground font-caption">
            Growth Journey
          </p>
        </div>
      </div>
      {/* Today's Photo Upload */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Today's Photo
        </h3>
        
        {!todayPhotoUploaded ? (
          <div className="relative">
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="sr-only"
                disabled={isUploading}
              />
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                {isUploading ? (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="animate-spin">
                      <Icon name="Loader2" size={32} className="text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground font-caption">
                      Uploading your photo...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3">
                    <Icon name="Camera" size={32} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Upload Today's Photo
                      </p>
                      <p className="text-xs text-muted-foreground font-caption">
                        Click to select or drag and drop
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-accent">
                      <Icon name="Zap" size={12} />
                      <span className="font-medium font-data">+10 XP</span>
                    </div>
                  </div>
                )}
              </div>
            </label>
          </div>
        ) : (
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="CheckCircle" size={20} className="text-success" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Photo Uploaded Successfully! 📸
                </h3>
                <p className="text-xs text-muted-foreground font-caption">
                  Come back tomorrow to upload the next photo
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Photo Timeline */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Recent Photos
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
          >
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {recentPhotos?.slice(0, 4)?.map((photo) => (
            <div
              key={photo?.id}
              className="group relative aspect-square rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors"
            >
              <Image
                src={photo?.url}
                alt={`Plant photo from day ${photo?.day}`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="text-white">
                    <div className="text-xs font-medium font-data">
                      Day {photo?.day}
                    </div>
                    <div className="text-xs opacity-80 font-caption">
                      {formatDate(photo?.date)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Day Badge */}
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold font-data px-2 py-1 rounded-md">
                {photo?.day}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Growth Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold font-data text-foreground">
              {recentPhotos?.length}
            </div>
            <div className="text-xs text-muted-foreground font-caption">
              Photos Taken
            </div>
          </div>
          <div>
            <div className="text-lg font-bold font-data text-foreground">
              {getCurrentDay() - 1}
            </div>
            <div className="text-xs text-muted-foreground font-caption">
              Days Tracked
            </div>
          </div>
          <div>
            <div className="text-lg font-bold font-data text-success">
              100%
            </div>
            <div className="text-xs text-muted-foreground font-caption">
              Upload Rate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantPhotoCard;