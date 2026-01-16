"use client";

import { Filter, SortAsc } from "lucide-react";
import { SortOption } from "./types";

interface FilterBarProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  availableTags: string[];
  activeTags: string[];
  onToggleTagFilter: (tag: string) => void;
}

export default function FilterBar({
  currentSort,
  onSortChange,
  availableTags,
  activeTags,
  onToggleTagFilter,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-white/5 border border-white/5 rounded-2xl">
      {/* SORT CONTROLS */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest flex items-center gap-1">
          <SortAsc size={12} /> Sort:
        </span>
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="bg-black/20 border border-white/10 rounded-lg text-xs text-slate-300 px-3 py-1.5 focus:outline-none focus:border-purple-500 w-full md:w-auto"
        >
          <option value="manual">Manual / Default</option>
          <option value="alpha_asc">Alphabetical (A-Z)</option>
          <option value="alpha_desc">Alphabetical (Z-A)</option>
          <option value="date_asc">Due Date (Soonest)</option>
          <option value="date_desc">Due Date (Latest)</option>
          <option value="created_desc">Newest Added</option>
        </select>
      </div>

      <div className="w-px h-8 bg-white/10 hidden md:block" />

      {/* TAG FILTER */}
      <div className="flex-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest flex items-center gap-1 shrink-0">
            <Filter size={12} /> Filter:
          </span>
          {availableTags.length === 0 && (
            <span className="text-xs text-slate-600 italic">No tags found</span>
          )}
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onToggleTagFilter(tag)}
              className={`whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                activeTags.includes(tag)
                  ? "bg-purple-500 text-white border-purple-500"
                  : "bg-transparent border-slate-700 text-slate-500 hover:border-slate-500"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
