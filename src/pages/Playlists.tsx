import { useAuth } from "@/contexts/AuthContext";
import PlaylistItem from "@/components/PlaylistItem";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { useEffect } from "react";

const Playlists = () => {
  const { accessToken, login } = useAuth();

  const {
    data: playlists,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["playlists", accessToken],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("No access token");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/playlists?part=snippet%2CcontentDetails%2Cstatus&mine=true&maxResults=50&key=${import.meta.env.VITE_API_KEY}`,
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
        <h1 className="mb-6 text-2xl font-bold text-white">Danh sách phát</h1>
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
    toast.error("Đã xảy ra lỗi khi tải danh sách phát!");
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderIcon className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Danh sách phát</h1>
      <div className="grid grid-cols-1 gap-4 gap-y-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {playlists.items.map((playlist: any) => (
          <PlaylistItem
            key={playlist.id}
            id={playlist.id}
            title={playlist.snippet.title}
            channelTitle={playlist.snippet.channelTitle}
            thumbnails={
              playlist.snippet.thumbnails?.maxres?.url ||
              playlist.snippet.thumbnails?.default?.url
            }
            isPrivate={true}
            videoCount={playlist.contentDetails.itemCount}
          />
        ))}
      </div>
    </div>
  );
};

export default Playlists;
