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

// Function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

// Function to get video details with retry logic
const fetchVideoDetails = async (videoId: string): Promise<FetchResult> => {
  let attempts = 0;
  const maxAttempts = 5;
  const delayDuration = 3000;

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`${API_URL}?videoId=${videoId}`, options);
      const result: VideoResponse = await response.json();

      await delay(delayDuration);

      if (result.videos?.items && result.videos.items.length > 0) {
        const videosWithAudio = result.videos.items.filter(item => item.hasAudio);
        const highestQualityVideo = videosWithAudio.sort((a, b) => {
          const qualityA = parseInt(a.quality.replace('p', ''), 10);
          const qualityB = parseInt(b.quality.replace('p', ''), 10);
          return qualityB - qualityA;
        })[0];


        return { mp4Url: highestQualityVideo.url };
      } else {
        console.log('Video data not found, retrying...');
      }
    } catch (error) {
      console.error('Error fetching video data:', error);
    }

    attempts++;
    if (attempts < maxAttempts) {
      console.log(`Retrying in ${delayDuration / 1000} seconds...`);
      await delay(delayDuration);
    }
  }

  return { error: 'Failed to fetch video details after multiple attempts' };
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