import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { PrevIcon } from '../components/icon/PrevIcon';
import { NextIcon } from '../components/icon/NextIcon';
import { LikeIcon } from '../components/icon/LikeIcon';
import { DislikeIcon } from '../components/icon/DislikeIcon';
import { CommentIcon } from '../components/icon/CommentIcon';
import { ShareShortIcon } from '../components/icon/ShareShortIcon';

const API_KEY = "AIzaSyBdXIlgcszYvgSOeUg7roEqfaaa_Vawj8g";

const ShortPage = () => {
  const [shorts, setShorts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isScrolling = useRef(false);

  const getShortVideos = async (channelId: string) => {
    try {
      const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          part: 'snippet',
          channelId: channelId,
          maxResults: 50,
          type: 'video',
          videoDuration: 'short',
          key: API_KEY,
          order: 'date',
        },
      });

      const videoIds = response.data.items.map((item: any) => item.id.videoId).join(',');

      const statsResponse = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
        params: {
          part: 'statistics',
          id: videoIds,
          key: API_KEY,
        },
      });

      const videos = response.data.items.map((item: any) => {
        const stats = statsResponse.data.items.find((stat: any) => stat.id === item.id.videoId);
        return { ...item, statistics: stats.statistics };
      });

      return videos;
    } catch (error) {
      console.error('Error fetching data:', JSON.stringify(error, null, 2));
      return [];
    }
  };

  useEffect(() => {
    async function fetchShorts() {
      const videos = await getShortVideos('UCAhfSPCb_HzvHSI54YCZ6GA');
      setShorts(videos);
    }

    fetchShorts();
  }, []);

  useEffect(() => {
    if (shorts.length > 0) {
      console.log('Current video statistics:', shorts[currentIndex].statistics);
    }
  }, [currentIndex, shorts]);

  const handleScroll = (event: React.WheelEvent) => {
    if (isScrolling.current) return;

    isScrolling.current = true;

    if (event.deltaY > 0) {
      handleNextVideo();
    } else if (event.deltaY < 0) {
      handlePrevVideo();
    }

    setTimeout(() => {
      isScrolling.current = false;
    }, 1500); // Adjust the debounce delay as needed
  };

  const handleNextVideo = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % shorts.length);
  };

  const handlePrevVideo = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + shorts.length) % shorts.length);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-white relative p-5" onWheel={handleScroll}>
      {shorts.length > 0 && (
        <div className="relative w-full max-w-md bg-card rounded-lg overflow-hidden shadow-lg" style={{ height: '800px' }}>
          <iframe
            src={`https://www.youtube.com/embed/${shorts[currentIndex].id.videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video player"
            className="w-full h-full border-none"
          ></iframe>
          <div className="absolute bottom-10 left-2.5 right-2.5 z-10 bg-black bg-opacity-60 p-2.5 rounded-md">
            <h3 className="text-lg font-bold m-0">{shorts[currentIndex].snippet.title}</h3>
            <p className="text-sm text-gray-400 m-0">{shorts[currentIndex].snippet.channelTitle}</p>
          </div>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 md:gap-4">
            <div className="flex flex-col items-center justify-center bg-muted text-white w-12 h-12 rounded-full cursor-pointer transition-colors duration-300 hover:bg-muted-foreground">
              <LikeIcon />
              {shorts.length > 0 && <span className="text-xs mt-1">{shorts[currentIndex].statistics.likeCount}</span>}
            </div>
            <div className="flex flex-col items-center justify-center bg-muted text-white w-12 h-12 rounded-full cursor-pointer transition-colors duration-300 hover:bg-muted-foreground">
              <DislikeIcon />
            </div>
            <div className="flex flex-col items-center justify-center bg-muted text-white w-12 h-12 rounded-full cursor-pointer transition-colors duration-300 hover:bg-muted-foreground">
              <CommentIcon />
              {shorts.length > 0 && <span className="text-xs mt-1">{shorts[currentIndex].statistics.commentCount}</span>}
            </div>
            <div className="flex items-center justify-center bg-muted text-white w-12 h-12 rounded-full cursor-pointer transition-colors duration-300 hover:bg-muted-foreground">
              <ShareShortIcon />
            </div>
          </div>
        </div>
      )}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 hidden md:flex">
        <button type="button" className="bg-muted text-white w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-muted-foreground" onClick={handlePrevVideo} title="Previous Video">
          <PrevIcon />
        </button>
        <button type="button" className="bg-muted text-white w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-muted-foreground" onClick={handleNextVideo} title="Next Video">
          <NextIcon />
        </button>
      </div>
    </div>
  );
};

export default ShortPage;