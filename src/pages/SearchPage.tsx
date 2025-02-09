import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { VideoItem } from "@/components/VideoItem";
import { toast } from "sonner";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const {
    data: searchResults,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/search?part=snippet&maxResults=20&q=${searchQuery}&type=video&key=${import.meta.env.VITE_API_KEY}`,
      );
      const data = await response.json();
      return data.items;
    },
    enabled: !!searchQuery,
  });

  if (isError) {
    toast.error("Đã xảy ra lỗi khi tìm kiếm!");
  }

  return (
    <div className="">
      <div className="m-5 space-y-4">
        {isLoading
          ? [...Array(5)].map((_, i) => (
              <VideoItem.Skeleton key={i} layout="horizontal" />
            ))
          : searchResults?.map((video: any) => (
              <VideoItem
                className="grid gap-5 md:grid-cols-[500px_1fr] [&_img]:h-64"
                key={video.id.videoId}
                fullText
                viewCount={video.statistics?.viewCount}
                thumbnail={
                  video.snippet.thumbnails?.high?.url ||
                  video.snippet.thumbnails?.default?.url
                }
                duration={video.contentDetails?.duration}
                title={video.snippet.title}
                channelId={video.snippet.channelId}
                id={video.id.videoId}
                channelTitle={video.snippet.channelTitle}
                publishedAt={video.snippet.publishedAt}
              />
            ))}
      </div>
    </div>
  );
};

export default SearchPage;
