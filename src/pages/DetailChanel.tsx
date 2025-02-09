import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatSubscribers } from "@/lib/utils";
import { useEffect, useState } from "react";
import { LoaderIcon, Search } from "lucide-react";
import { VideoItem } from "@/components/VideoItem";
import PlaylistItem from "@/components/PlaylistItem";

function DetailChanel() {
  const { chanelId } = useParams();
  const [activeTab, setActiveTab] = useState("home");

  const {
    data: channel,
    isLoading: isLoadingChannel,
    isError: isErrorChannel,
  } = useQuery({
    queryKey: ["channel", chanelId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/channels?part=snippet,statistics,brandingSettings&id=${chanelId}&key=${import.meta.env.VITE_API_KEY}`,
      );
      const data = await response.json();
      return data.items[0];
    },
    staleTime: 30 * 60 * 1000,
  });
  const {
    data: videos,
    isLoading: isLoadingVideos,
    isError: isErrorVideos,
  } = useQuery({
    queryKey: ["channelVideos", chanelId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/search?part=snippet&channelId=${chanelId}&maxResults=50&order=date&type=video&key=${import.meta.env.VITE_API_KEY}`,
      );
      const searchData = await response.json();

      // Fetch additional video details
      const videoIds = searchData.items
        .map((item: any) => item.id.videoId)
        .join(",");
      const videoDetailsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/videos?part=contentDetails,statistics&id=${videoIds}&key=${import.meta.env.VITE_API_KEY}`,
      );
      const videoDetailsData = await videoDetailsResponse.json();

      // Merge search results with video details
      return searchData.items.map((item: any, index: number) => ({
        ...item,
        contentDetails: videoDetailsData.items[index].contentDetails,
        statistics: videoDetailsData.items[index].statistics,
      }));
    },
    staleTime: 30 * 60 * 1000,
  });

  const {
    data: playlists,
    isLoading: isLoadingPlaylists,
    isError: isErrorPlaylists,
  } = useQuery({
    queryKey: ["channelPlaylists", chanelId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/playlists?part=snippet,contentDetails&channelId=${chanelId}&maxResults=50&key=${import.meta.env.VITE_API_KEY}`,
      );
      const data = await response.json();
      return data;
    },
    staleTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isErrorChannel || isErrorVideos || isErrorPlaylists) {
    toast.error("Đã xảy ra lỗi khi tải thông tin!");
  }

  if (isLoadingChannel || isLoadingVideos || isLoadingPlaylists) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderIcon className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "home", label: "Trang chủ" },
    { id: "videos", label: "Video" },
    { id: "shorts", label: "Shorts" },
    { id: "playlists", label: "Danh sách phát" },
    { id: "posts", label: "Bài đăng" },
  ];

  return (
    <div>
      <div className="relative w-full px-5 xl:px-20">
        <div className="aspect-[6/1] w-full overflow-hidden rounded-2xl">
          <img
            src={channel?.brandingSettings?.image?.bannerExternalUrl}
            alt="Channel Banner"
            className="h-full w-full bg-neutral-950 object-cover"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = "none";
            }}
          />
        </div>
      </div>
      <div className="mx-5 py-5 xl:mx-20">
        <div className="flex items-start gap-4">
          <Avatar className="h-36 w-36">
            <AvatarImage
              src={
                channel?.snippet.thumbnails?.high?.url ||
                channel?.snippet.thumbnails?.default?.url
              }
            />
            <AvatarFallback>{channel?.snippet.title.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-medium">{channel?.snippet.title}</h1>
            </div>
            <div className="flex flex-col text-sm text-muted-foreground">
              <span>{channel?.snippet.customUrl}</span>
              <span>
                {channel
                  ? formatSubscribers(channel?.statistics.subscriberCount)
                  : ""}{" "}
                người đăng ký • {channel?.statistics.videoCount} video
              </span>
              <span className="line-clamp-1">
                {channel?.snippet.description}
              </span>
              <div className="inline-flex items-center space-x-1">
                <a
                  href={channel?.snippet.customUrl}
                  className="text-[rgb(62,166,255)]"
                >
                  {channel?.snippet.customUrl}
                </a>

                <span className="text-white no-underline">
                  và {channel?.statistics.videoCount} đường liên kết khác
                </span>
              </div>
            </div>
            <button className="mt-2 h-9 w-fit rounded-full border border-gray-300 bg-white px-4 text-sm leading-9 text-black transition-colors hover:bg-gray-100">
              Đăng ký
            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-4 border-b border-gray-700 pb-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`bg-transparent px-4 py-1 text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-white font-medium text-white"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button className="text-muted-foreground hover:text-white">
              <Search className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {(activeTab === "videos" || activeTab === "home") &&
              videos?.map((video: any) => (
                <VideoItem
                  key={video.id.videoId}
                  id={video.id.videoId}
                  thumbnail={video.snippet.thumbnails.high.url}
                  title={video.snippet.title}
                  channelId={video.snippet.channelId}
                  channelTitle={video.snippet.channelTitle}
                  publishedAt={video.snippet.publishedAt}
                  viewCount={parseInt(video.statistics.viewCount)}
                  duration={video.contentDetails.duration}
                />
              ))}

            {activeTab === "playlists" &&
              playlists?.items?.map((playlist: any) => (
                <PlaylistItem
                  key={playlist.id}
                  id={playlist.id}
                  title={playlist.snippet.title}
                  channelTitle={playlist.snippet.channelTitle}
                  thumbnails={
                    playlist.snippet.thumbnails?.maxres?.url ||
                    playlist.snippet.thumbnails?.default?.url
                  }
                  videoCount={playlist.contentDetails.itemCount}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailChanel;
