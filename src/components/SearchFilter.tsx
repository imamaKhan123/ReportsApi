import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import React from "react";
interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  loading?: boolean;
}

export function SearchFilter({ 
  searchQuery, 
  onSearchChange, 
  placeholder = "Search reports by ID, type, publisher, or title...",
  loading = false 
}: SearchFilterProps) {
  const handleClear = () => {
    onSearchChange("");
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="search-input">Search Reports</Label>
      <div className="relative">
        <Input
          id="search-input"
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={loading}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
            title="Clear search"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      {searchQuery && (
        <p className="text-xs text-muted-foreground">
          Searching for: <span className="font-medium">"{searchQuery}"</span>
        </p>
      )}
    </div>
  );
}