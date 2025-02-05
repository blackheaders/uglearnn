import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

interface VideoPlayerProps {
  url: string;
  image: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, image }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(url);
  const [hasError, setHasError] = useState(false);

  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');

  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    if (isYouTube) {
      setIsLoading(true);
      fetchMp4Link(url)
        .then((mp4Url) => {
          if (mp4Url && mp4Url !== url) {
            setVideoSrc(mp4Url);
            setHasError(false);
          } else {
            setHasError(true);
          }
        })
        .catch(() => setHasError(true))
        .finally(() => setIsLoading(false));
    }
  }, [url]);

  const fetchMp4Link = async (youtubeUrl: string): Promise<string> => {
    try {
      const videoId = getYouTubeVideoId(youtubeUrl);
      if (!videoId) throw new Error("Invalid YouTube URL");
      
      const response = await axios.get(`/api/ytube?videoId=${videoId}`, { timeout: 60000 });
      return response.data.mp4Url;
    } catch (error) {
      return youtubeUrl; // Return the original URL if fetching fails
    }
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden">
      {isLoading ? (
        <div className="flex relative items-center justify-center w-full bg-gray-800 text-white">
          <img src={image} alt="Loading preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </div>
      ) : hasError && isYouTube ? (
        // If an error occurs, display the YouTube iframe
        <iframe
        className="w-full aspect-video rounded-lg shadow-lg border border-gray-600"
        src={`https://www.youtube.com/embed/${getYouTubeVideoId(url)}?autoplay=1&modestbranding=1&rel=0&showinfo=0&disablekb=1&iv_load_policy=3`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      ></iframe>      
      ) : (
        <video
          ref={videoRef}
          className="w-full rounded-lg"
          controls
          controlsList="nodownload"
          playsInline
          src={videoSrc ?? url}
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoPlayer;
