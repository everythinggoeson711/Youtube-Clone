import moment from "moment";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, convertISO8601ToHHMMSS, formatViews } from "@/lib/utils";

interface VideoItemProps {
  id: string;
  fullText?: boolean;
  channelId: string;
  thumbnail: string;
  title: string;
  channelTitle: string;
  viewCount: number;
  duration: string;
  publishedAt: string;
  className?: string;
}

export const VideoItem = ({
  id,
  thumbnail,
  fullText = false,
  title,
  channelTitle,
  viewCount,
  duration,
  publishedAt,
  className,
  channelId
}: VideoItemProps) => {

  const { data: channelData } = useQuery({
    queryKey: ["channel", channelId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/channels?part=snippet&id=${channelId}&key=${import.meta.env.VITE_API_KEY}`
      );
      const data = await response.json();
      return data.items[0];
    },
    staleTime: 30 * 60 * 1000,
  });

  const avatarUrl = channelData?.snippet?.thumbnails?.default?.url;
  const fallbackText = channelData?.snippet?.title.charAt(0) || channelTitle.charAt(0);

  return (
    <Link to={`/watch/${id}`} className={cn("cursor-pointer", className)}>
      <div className="relative overflow-hidden rounded-md">
        <img
          src={thumbnail}
          alt={title}
          className="h-56 w-full rounded-md object-cover transition-all duration-150 ease-in hover:scale-105"
        />
        {duration && (
          <span className="absolute bottom-2 right-2 rounded-sm bg-black/40 px-1 py-[2px] text-xs">
            {convertISO8601ToHHMMSS(duration)}
          </span>
        )}
      </div>
      <div className="my-2 flex items-start gap-3">
        <Link
          to={`/chanel/${channelId}`}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            window.location.href = `/chanel/${channelId}`;
          }}
        >
          <Avatar className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9 ">
            <AvatarImage
              src={avatarUrl}
              alt={`${channelTitle} avatar`}
              className=" object-cover"
            />
            <AvatarFallback>{fallbackText}</AvatarFallback>
          </Avatar>

        </Link>
        <div>
          <h1 className="font-medium">
            {!fullText
              ? title.length > 50
                ? title.slice(0, 47) + "..."
                : title
              : title}
          </h1>
          <p className="text-sm text-muted-foreground">{channelTitle}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {viewCount && (
              <div className="flex items-center gap-1">
                <span>{formatViews(viewCount)}</span>
                <span>•</span>
              </div>
            )}
            <span>{moment(publishedAt).fromNow()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

VideoItem.Skeleton = ({ layout = "vertical" }: { layout?: "vertical" | "horizontal" }) => {
  return (
    <div className={cn("", { "grid grid-cols-2 gap-2": layout === "horizontal" })}>
      <Skeleton className={cn("min-h-40 w-full", { "h-60": layout === "horizontal" })} />
      <div className={cn("my-2 flex gap-2", { "m-0": layout === "horizontal" })}>
        {layout === "vertical" && <Skeleton className="h-10 w-10 rounded-full" />}
        <div className="flex-1">
          <Skeleton className="h-5" />
          <Skeleton className="mt-2 h-3" />
        </div>
      </div>
    </div>
  );
};
