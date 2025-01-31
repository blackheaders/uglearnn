import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

interface VideoPlayerProps {
  url: string;
  onTimeUpdate?: (currentTime: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, onTimeUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoSrc, setVideoSrc] = useState(url);
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');

  function getYouTubeVideoId(url:string) {
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
  useEffect(() => {
    if (isYouTube) {
      setIsLoading(true);
      fetchMp4Link(url).then((mp4Url) => {
        setVideoSrc(mp4Url);
        setIsLoading(false);
      }).catch(() => setIsLoading(false));
    }
  }, [url]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && onTimeUpdate) {
      const handleTimeUpdate = () => onTimeUpdate(video.currentTime);
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, [onTimeUpdate]);

  const fetchMp4Link = async (youtubeUrl: string): Promise<string> => {
    try {
        const videoId = getYouTubeVideoId(youtubeUrl);
      const response = await axios.get(`/api/ytube?videoId=${videoId}`);
      return response.data.mp4Url;

    } catch (error) {
      console.error("Error fetching MP4 link:", error);
      return url;
    }
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-64 bg-gray-800 text-white">
          Loading video...
        </div>
      ) : (
        <video
          ref={videoRef}
          className="w-full rounded-lg"
          controls
          controlsList="nodownload"
          playsInline
          src={videoSrc}
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoPlayer;
