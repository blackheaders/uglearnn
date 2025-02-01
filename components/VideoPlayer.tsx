import React, { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  url: string;
  onTimeUpdate?: (currentTime: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, onTimeUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');

  useEffect(() => {
    const video = videoRef.current;
    if (video && onTimeUpdate) {
      video.addEventListener('timeupdate', () => onTimeUpdate(video.currentTime));
      return () => video.removeEventListener('timeupdate', () => onTimeUpdate(video.currentTime));
    }
  }, [onTimeUpdate]);

  if (isYouTube) {
    const videoId = url.split('v=')[1] || url.split('/').pop();
    return (
      <div className="relative w-full pt-[56.25%]">
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&modestbranding=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      className="w-full rounded-lg aspect-video"
      controls
      controlsList="nodownload"
      playsInline
    >
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

export default VideoPlayer;