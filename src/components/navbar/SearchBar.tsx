import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  return (
    <div className="mx-6 hidden max-w-sm flex-1 md:flex">
      <div className="relative w-full">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2 transform" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default SearchBar;
