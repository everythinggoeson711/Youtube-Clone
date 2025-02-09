import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { formatViews } from "@/lib/utils";

const LikedVideo = () => {
  const { accessToken, login } = useAuth();
  //   const fetchLikedVideos = async () => {
  //     try {
  //       setLoading(true);

  //       if (!accessToken) {
  //         setLoading(false);
  //         return;
  //       }

  //       const response = await axios.get(
  //         `${import.meta.env.VITE_API_URL}/videos`,
  //         {
  //           params: {
  //             part: "snippet,statistics",
  //             myRating: "like",
  //             maxResults: 50,
  //           },
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //         },
  //       );

  //       if (response.data.items?.length > 0) {
  //         setVideos(response.data.items);
  //       }
  //       setLoading(false);
  //     } catch (err: any) {
  //       toast.error(err);
  //     }
  //   };

  //   fetchLikedVideos();
  // }, [accessToken]);

  const {
    data: videos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["likedVideos", accessToken],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("No access token");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/videos?part=snippet%2Cstatistics&myRating=like&maxResults=50&key=${import.meta.env.VITE_API_KEY}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch playlists");
      }

      const data = await response.json();
      return data;
    },
    enabled: !!accessToken,
    staleTime: 30 * 60 * 1000,
  });

  if (!accessToken) {
    return (
      <div className="p-6 text-center">
        <h1 className="mb-6 text-2xl font-bold text-white">Video đã thích</h1>
        <button
          onClick={login}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Đăng nhập với Google
        </button>
      </div>
    );
  }

  if (isError) {
    toast.error("Đã xảy ra lỗi khi tải danh sách video!");
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-[1280px] bg-[#0f0f0f] px-4 py-6">
      <div className="mb-6 flex items-center gap-4 rounded-xl bg-[#282828] p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600">
          <svg
            className="h-6 w-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Video đã thích</h1>
          <p className="text-sm text-gray-400">
            {videos?.items.length} video • Riêng tư
          </p>
        </div>
      </div>
      {videos?.items.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {videos?.items.map((video: any) => (
            <Link
              to={`/watch/${video.id}`}
              key={video.id}
              className="flex flex-col gap-4 rounded-xl bg-[#212121] p-3 transition-all duration-200 hover:bg-[#282828] md:flex-row"
            >
              <div className="group relative aspect-video overflow-hidden rounded-xl md:w-[360px]">
                <img
                  src={
                    video.snippet.thumbnails?.maxres?.url ||
                    video.snippet.thumbnails?.default?.url
                  }
                  alt={video.snippet.title}
                  className="h-full w-full transform object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/20 group-hover:opacity-100">
                  <svg
                    className="h-12 w-12 translate-y-2 transform text-white drop-shadow-lg filter transition-transform duration-200 group-hover:translate-y-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs text-white">
                  3:45
                </div>
              </div>
              <div className="min-w-0 flex-1 py-1">
                <h2 className="mb-1 line-clamp-2 text-lg font-medium text-white transition-colors hover:text-blue-400">
                  {video.snippet.title}
                </h2>
                <div className="mb-2 flex flex-wrap items-center gap-x-1 text-sm text-gray-400">
                  <span className="cursor-pointer font-medium transition-colors hover:text-white">
                    {video.snippet.channelTitle}
                  </span>
                  <span>•</span>
                  {video.statistics && (
                    <>
                      <span>{formatViews(video.statistics.viewCount)}</span>
                      <span>•</span>
                    </>
                  )}
                  <span>
                    {formatDistanceToNow(new Date(video.snippet.publishedAt), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-gray-400 transition-colors hover:text-gray-300">
                  {video.snippet.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-[#282828] py-16">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#212121]">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <p className="mb-2 text-lg font-medium text-white">
            Chưa có video nào trong danh sách yêu thích
          </p>
          <p className="mb-6 text-gray-400">
            Các video bạn thích sẽ xuất hiện tại đây
          </p>
          <Link
            to="/"
            className="rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-2.5 font-medium text-white shadow-md transition-all duration-200 hover:from-red-600 hover:to-red-700 hover:shadow-lg active:scale-95"
          >
            Khám phá video
          </Link>
        </div>
      )}
    </div>
  );
};

export default LikedVideo;
