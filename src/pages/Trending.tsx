import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const SidebarItems = [
  { id: 1, name: "Trending" },
  { id: 2, name: "Music" },
  { id: 3, name: "Gaming" },
  { id: 4, name: "Movies" },
];

const instance = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
});

function timeSince(postedDate: string): string {
  const now = new Date();
  const postDate = new Date(postedDate);
  const elapsed = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  const minutes = Math.floor(elapsed / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} năm trước`;
  if (months > 0) return `${months} tháng trước`;
  if (days > 0) return `${days} ngày trước`;
  if (hours > 0) return `${hours} giờ trước`;
  if (minutes > 0) return `${minutes} phút trước`;
  return `${elapsed} giây trước`;
}

const formatViews = (views: number): string => {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views.toString();
};

type VideoType = {
  title: string;
  channel: string;
  videoId: string;
  views: number;
  date: string;
  description: string;
};

export default function Trending() {
  const [isSelected, setIsSelected] = useState<string>("Trending");

  const {
    data: videos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["trending", isSelected],
    queryFn: async () => {
      const searchResponse = await instance.get("search", {
        params: {
          part: "snippet",
          q: isSelected,
          type: "video",
          order: "date",
          regionCode: "VN",
          maxResults: "20",
          key: "AIzaSyALqsPow3wkH_HifbNaMLoDBV8mLIUrF3c",
        },
      });

      const videoIds = searchResponse.data.items
        .map((item: { id: { videoId: string } }) => item.id.videoId)
        .join(",");

      const videoDetails = await instance.get("videos", {
        params: {
          part: "snippet,statistics",
          id: videoIds,
          key: "AIzaSyALqsPow3wkH_HifbNaMLoDBV8mLIUrF3c",
        },
      });

      return videoDetails.data.items.map(
        (item: {
          snippet: {
            title: string;
            channelTitle: string;
            publishedAt: string;
            description: string;
          };
          statistics: { viewCount: string };
          id: string;
        }) => ({
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          videoId: item.id,
          views: parseInt(item.statistics.viewCount, 10),
          date: item.snippet.publishedAt,
          description: item.snippet.description,
        }),
      ) as VideoType[];
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isError) {
    toast.error("Đã xảy ra lỗi khi tải video!");
  }

  return (
    <div className="flex flex-col gap-4 p-8">
      <Header />
      <Sidebar isSelected={isSelected} onIsSelected={setIsSelected} />
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <LoaderIcon className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <VideosList videos={videos || []} />
      )}
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center gap-4">
      <img
        src="https://www.youtube.com/img/trending/avatar/trending_animated.webp"
        alt="logo-trending"
        className="h-20"
      />
      <h1 className="text-xl font-bold text-white">Trending</h1>
    </div>
  );
}

function Sidebar({
  isSelected,
  onIsSelected,
}: {
  isSelected: string;
  onIsSelected: (name: string) => void;
}) {
  return (
    <ul className="sticky top-0 z-[10000] flex gap-4 bg-[#0f0f0f] text-lg font-medium text-white">
      {SidebarItems.map((item) => (
        <li
          key={item.id}
          className={`cursor-pointer ${
            isSelected === item.name ? "border-b-2 border-white" : ""
          }`}
          onClick={() => onIsSelected(item.name)}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}

function VideosList({ videos }: { videos: VideoType[] }) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {videos.map((video) => (
        <Video key={video.videoId} video={video} />
      ))}
    </div>
  );
}

function Video({ video }: { video: VideoType }) {
  return (
    <Link to={`/watch/${video.videoId}`}>
      <div className="flex gap-4">
        <Iframe src={`https://www.youtube.com/embed/${video.videoId}`} />
        <VideoInfo video={video} />
      </div>
    </Link>
  );
}

function Iframe({ src }: { src: string }) {
  return (
    <div className="overflow-hidden rounded-lg">
      <iframe src={src} className="h-52 w-96" frameBorder="0" allowFullScreen />
    </div>
  );
}

function VideoInfo({ video }: { video: VideoType }) {
  return (
    <div className="w-96 text-white">
      <h1 className="text-lg font-bold">{video.title}</h1>
      <ul className="flex gap-2 text-sm text-gray-400">
        <li>{video.channel}</li>
        <li>{formatViews(video.views)}</li>
        <li>{timeSince(video.date)}</li>
      </ul>
      <p className="mt-2 text-xs text-gray-400">
        {video.description.length > 100
          ? video.description.slice(0, 100) + "..."
          : video.description}
      </p>
    </div>
  );
}
