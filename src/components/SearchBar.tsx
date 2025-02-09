import { SearchIcon } from "@/components/icon";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const query = searchParams.get("q");
    setSearchQuery(query || "");
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[600px] items-center"
    >
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Tìm kiếm"
        className="h-10 w-full rounded-l-full border border-white/10 bg-transparent px-4 outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        className="border-l-1 flex h-10 items-center rounded-r-full border border-white/10 bg-white/10 px-6 hover:bg-white/20"
      >
        <SearchIcon />
      </button>
    </form>
  );
};
