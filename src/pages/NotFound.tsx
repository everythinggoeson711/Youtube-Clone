import { YoutubeIcon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex h-[calc(100vh-56px)] w-full flex-col items-center justify-center">
      <div className="mb-4 flex items-center justify-center gap-2">
        <YoutubeIcon />
        <h1 className="border-l-2 p-4 text-4xl font-medium">Not Found</h1>
      </div>
      <Button variant="secondary" asChild>
        <Link to="/">Trang chủ</Link>
      </Button>
    </div>
  );
};

export default NotFound;
