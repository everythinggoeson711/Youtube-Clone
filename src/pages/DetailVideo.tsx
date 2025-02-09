import {
  DownloadIcon,
  EllipsisIcon,
  LikeIcon,
  ShareIcon,
} from "@/components/icon";
import { Label } from "@/components/Label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoItem } from "@/components/VideoItem";
import { Categories } from "@/layouts/components/Categories";
import { formatLikes, formatSubscribers, formatViews } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

const DetailVideo = () => {
  const { videoId } = useParams();

  const {
    data: video,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["video", videoId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/videos?part=snippet,contentDetails,statistics,player&id=${videoId}&key=${import.meta.env.VITE_API_KEY}`,
      );
      const data = await response.json();
      return data.items[0];
    },
  });

  const { data: channel } = useQuery({
    queryKey: ["channel", video?.snippet?.channelId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/channels?part=snippet,statistics&id=${video?.snippet?.channelId}&key=${import.meta.env.VITE_API_KEY}`,
      );
      const data = await response.json();
      return data.items[0];
    },
    enabled: !!video?.snippet?.channelId,
  });

  const categoryId = video?.snippet?.categoryId ?? "0";

  const { data: relatedVideos } = useQuery({
    queryKey: ["relatedVideos", videoId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=VN&maxResults=10&videoCategoryId=${categoryId}&key=${import.meta.env.VITE_API_KEY}`,
      );
      const data = await response.json();
      return data.items;
    },
    enabled: !!videoId,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isError) {
    toast.error("Đã xảy ra lỗi khi tải video!");
  }

  if (isLoading) {
    return (
      <div className="mx-5 py-5 xl:mx-20">
        <div className="grid gap-5 lg:grid-cols-[1fr_450px]">
          <div className="">
            <Skeleton className="min-h-[300px] w-full rounded-lg md:min-h-[400px] xl:h-[600px]" />
            <div className="my-4 flex flex-col gap-4">
              <Skeleton className="h-10 w-full" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-2 w-20" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-20 rounded-full" />
                  <Skeleton className="h-10 w-20 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-60 w-full" />
            </div>
          </div>
          <div className="space-y-4">
            <Categories className="categories min-h-fit flex-nowrap overflow-x-auto" />
            {[...Array(5)].map((_, i) => (
              <VideoItem.Skeleton key={i} layout="horizontal" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  console.log(channel);

  return (
    <div className="mx-5 py-5 xl:mx-20">
      <div className="grid gap-5 lg:grid-cols-[1fr_450px]">
        <div className="">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={video?.snippet?.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="my-4 flex flex-col gap-4">
            <h1 className="text-xl font-medium">{video?.snippet.title}</h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={channel?.snippet?.thumbnails?.default?.url}
                  />
                  <AvatarFallback>
                    {channel?.snippet?.title?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="">
                  <h1 className="font-medium">{channel?.snippet?.title}</h1>
                  <p className="text-xs text-muted-foreground">
                    {formatSubscribers(channel?.statistics?.subscriberCount)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label
                  icon={<LikeIcon />}
                  title={`${formatLikes(parseInt(video?.statistics?.likeCount))}`}
                />
                <Label icon={<ShareIcon />} title="Share" />
                <Label icon={<DownloadIcon />} title="Download" />
                <EllipsisIcon className="icon bg-white/10 hover:bg-white/25" />
              </div>
            </div>
            <div className="rounded-lg bg-white/20 p-3 text-sm">
              <div className="whitespace-pre-wrap font-sans">
                <div className="flex items-center gap-3 font-medium">
                  <span>{formatViews(video?.statistics?.viewCount)}</span>
                  <span>{moment(video?.snippet?.publishedAt).fromNow()}</span>
                </div>

                {video?.snippet?.description.length > 400
                  ? video?.snippet?.description.slice(0, 397) + "..."
                  : video?.snippet?.description}
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <Categories className="categories min-h-fit flex-nowrap overflow-x-auto" />
          <div className="my-4 space-y-4">
            {relatedVideos?.map((video: any) => (
              <VideoItem
                key={video.id}
                thumbnail={
                  video.snippet.thumbnails?.maxres?.url ||
                  video.snippet.thumbnails?.standard?.url
                }
                title={video.snippet.title}
                channelId={video.snippet.channelId}
                id={video.id}
                channelTitle={video.snippet.channelTitle}
                viewCount={video.statistics.viewCount}
                duration={video.contentDetails.duration}
                publishedAt={video.snippet.publishedAt}
                className="md:[&_img]:h-40"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailVideo;
