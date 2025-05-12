"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchableDropdownProps {
  items: {
    id: string;
    label: string;
    value: string;
  }[];
  placeholder?: string;
  onSelect: (item: { id: string; label: string; value: string }) => void;
  className?: string;
  selectedLabel?: string | null;
  buttonContent?: React.ReactNode;
}

const SearchableDropdown = ({
  items,
  placeholder = "Select...",
  onSelect,
  className = "",
  selectedLabel,
  buttonContent,
}: SearchableDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative " ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={className}
      >
        {buttonContent || (
          <div className="flex items-center">
            <span className="truncate">{selectedLabel || placeholder}</span>
            <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 w-32 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search labels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-1 w-full h-8 text-sm"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-sm ${
                    selectedLabel === item.label
                      ? "bg-gray-50 text-gray-900"
                      : "text-gray-700"
                  }`}
                  onClick={() => {
                    onSelect(item);
                    setSearchQuery("");
                    setIsOpen(false);
                  }}
                >
                  {item.label}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No labels found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
