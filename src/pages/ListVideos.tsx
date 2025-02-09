import { useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { toast } from "sonner";

import { VideoItem } from "@/components/VideoItem";
import { Categories } from "@/layouts/components/Categories";

const ListVideos = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category") || "";

  const { data, fetchNextPage, hasNextPage, isFetching, isError } =
    useInfiniteQuery({
      queryKey: ["videos", categoryId],
      initialPageParam: "",
      queryFn: async ({ pageParam = "" }) => {
        const categoryParam = categoryId
          ? `&videoCategoryId=${categoryId}`
          : "";
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=VN&maxResults=20${categoryParam}&pageToken=${pageParam}&key=${import.meta.env.VITE_API_KEY}`,
        );
        return response.json();
      },
      getNextPageParam: (lastPage) => {
        return lastPage.items?.length > 0 ? lastPage.nextPageToken : undefined;
      },
    });

  const observerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetching) {
            fetchNextPage();
          }
        },
        { threshold: 0.5 },
      );

      observer.observe(node);
      return () => observer.disconnect();
    },
    [hasNextPage, isFetching, fetchNextPage],
  );

  const videos = data?.pages.flatMap((page) => page.items) ?? [];

  if (isError) {
    toast.error("Đã xảy ra lỗi khi tải video!");
  }

  return (
    <div className="">
      <Categories className="categories sticky top-[56px] z-10 mx-5 flex-nowrap overflow-x-auto bg-background" />
      <div className="m-5 my-0 mt-3 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video: any) => (
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

      {isFetching && (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <VideoItem.Skeleton key={i} />
          ))}
        </div>
      )}

      {hasNextPage && <div ref={observerRef} style={{ height: "20px" }} />}

      {!hasNextPage && videos.length > 0 && (
        <p className="my-4 text-center text-muted-foreground">
          Không còn video để hiển thị
        </p>
      )}
    </div>
  );
};

export default ListVideos;
