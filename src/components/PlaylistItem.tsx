import { cn } from "@/lib/utils";
import { LockIcon, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { PlaylistIcon } from "./icon";

interface PlaylistItemProps {
  id: string;
  title: string;
  channelTitle: string;
  thumbnails: string;
  videoCount: number;
  className?: string;
  isPrivate?: boolean;
}

const PlaylistItem = ({
  id,
  title,
  channelTitle,
  thumbnails,
  videoCount,
  className,
  isPrivate,
}: PlaylistItemProps) => {
  return (
    <Link
      to={`/playlists/${id}`}
      onClick={(e) => isPrivate && e.preventDefault()}
      className={cn("block", className, {
        "cursor-not-allowed": isPrivate,
      })}
    >
      <div className="group relative">
        <div className="rounded-lg bg-background">
          <img
            src={thumbnails}
            alt={title}
            className="h-44 w-full rounded-lg object-cover group-hover:opacity-40"
          />
          <div className="absolute bottom-0 right-0 m-2 rounded bg-black/40 px-2 py-1">
            <p className="flex items-center gap-1 text-xs text-white">
              <PlaylistIcon className="h-4 w-4" />
              {videoCount} video
            </p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="hidden group-hover:block" />
          </div>
        </div>
        <div className="absolute -top-2 left-3 -z-10 h-5 w-[90%] rounded-3xl bg-gray-500/80" />
        <div className="absolute -top-1 left-1.5 -z-10 h-5 w-[95%] rounded-3xl bg-gray-400/90" />
      </div>
      <div className="mt-3">
        <h3 className="line-clamp-2 font-medium text-white">{title}</h3>
        {isPrivate && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <LockIcon className="h-4 w-4" />
            <span className="font-medium">Riêng tư</span>
          </div>
        )}
        <p className="mt-1 text-sm text-muted-foreground">{channelTitle}</p>
        <p className="text-sm font-medium text-muted-foreground">
          Xem danh sách phát đầy đủ
        </p>
      </div>
    </Link>
  );
};

export default PlaylistItem;
