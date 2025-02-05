import { NextRequest } from 'next/server';

const API_URL = 'https://youtube-media-downloader.p.rapidapi.com/v2/video/details';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

const options: RequestInit = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': RAPIDAPI_KEY ?? '',
    'x-rapidapi-host': 'youtube-media-downloader.p.rapidapi.com'
  }
};

interface VideoItem {
  quality: string;
  url: string;
  hasAudio: boolean;
}

interface VideoResponse {
  videos?: {
    items?: VideoItem[];
  };
}

interface FetchResult {
  mp4Url?: string;
  error?: string;
}

// Function to get video details (single attempt)
const fetchVideoDetails = async (videoId: string): Promise<FetchResult> => {
  try {
    const response = await fetch(`${API_URL}?videoId=${videoId}`, options);
    const result: VideoResponse = await response.json();

    if (result.videos?.items && result.videos.items.length > 0) {
      const videosWithAudio = result.videos.items.filter(item => item.hasAudio);
      const highestQualityVideo = videosWithAudio.sort((a, b) => {
        return parseInt(b.quality.replace('p', ''), 10) - parseInt(a.quality.replace('p', ''), 10);
      })[0];

      return { mp4Url: highestQualityVideo.url };
    } else {
      return { error: 'No video with audio found' };
    }
  } catch (error) {
    console.error('Error fetching video data:', error);
    return { error: 'Failed to fetch video details' };
  }
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return new Response(JSON.stringify({ error: 'Missing videoId parameter' }), { status: 400 });
  }

  const data = await fetchVideoDetails(videoId);
  return new Response(JSON.stringify(data), { status: data.error ? 500 : 200 });
}