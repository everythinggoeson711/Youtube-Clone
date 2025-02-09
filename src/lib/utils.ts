import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { parse, toSeconds } from "iso8601-duration";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertISO8601ToHHMMSS(duration: string) {
  const parsed = parse(duration);

  const totalSeconds = toSeconds(parsed);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
}

export const formatViews = (viewCount: number) => {
  if (viewCount >= 1000000) {
    return `${(viewCount / 1000000).toFixed(1)}Tr lượt xem`;
  } else if (viewCount >= 1000) {
    return `${(viewCount / 1000).toFixed(1)}N lượt xem`;
  }
  return `${viewCount} lượt xem`;
};

export function formatSubscribers(count: number) {
  if (count >= 1e9) {
    return (count / 1e9).toFixed(2).replace(/\.?0+$/, "") + " B người đăng ký";
  } else if (count >= 1e6) {
    return (count / 1e6).toFixed(2).replace(/\.?0+$/, "") + " Tr người đăng ký";
  } else if (count >= 1e3) {
    return (count / 1e3).toFixed(2).replace(/\.?0+$/, "") + " N người đăng ký";
  } else {
    return count + " người đăng ký";
  }
}

export function formatLikes(count: number) {
  if (count >= 1e9) {
    return (count / 1e9).toFixed(2).replace(/\.?0+$/, "") + " B";
  } else if (count >= 1e6) {
    return (count / 1e6).toFixed(2).replace(/\.?0+$/, "") + " M";
  } else if (count >= 1e3) {
    return (count / 1e3).toFixed(2).replace(/\.?0+$/, "") + " N";
  } else {
    return count;
  }
}
