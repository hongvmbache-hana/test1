import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import bannerBg from '../assets/images/vietnam_banner_bg_1786602496068.jpg';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
  totalProceduresCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onSelectFilter,
  totalProceduresCount
}) => {
  const quickFilters = [
    { id: 'all', label: 'Tất cả thủ tục' },
    { id: 'popular', label: '🔥 Phổ biến' }
  ];

  return (
    <div className="relative overflow-hidden bg-amber-50/60 dark:bg-slate-900 border-b border-amber-200/60 dark:border-slate-800 py-8 px-4 shadow-inner">
      {/* Background Image Layer (Traditional Dong Son Drum Motif Banner) */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 dark:opacity-20 pointer-events-none mix-blend-multiply dark:mix-blend-luminosity scale-105"
        style={{ backgroundImage: `url(${bannerBg})` }}
      />
      
      {/* Light Overlay Gradient for high contrast & readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-50/90 via-amber-50/40 to-amber-50/90 dark:from-slate-900/95 dark:via-slate-900/70 dark:to-slate-900/95 pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-4">
        
        {/* Search Input Box matching Clean Minimalism design */}
        <div className="relative flex items-center shadow-md rounded-2xl overflow-hidden border-2 border-red-200/80 dark:border-slate-700 focus-within:border-red-600 focus-within:ring-4 focus-within:ring-red-100 dark:focus-within:ring-red-950 transition-all bg-white/95 dark:bg-slate-800/95 backdrop-blur-md">
          <div className="pl-4 pr-2 text-slate-400">
            <Search className="w-5 h-5 text-red-600" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Nhập mã hoặc tên thủ tục hành chính để tìm kiếm..."
            className="w-full py-4 px-2 text-sm text-slate-900 dark:text-slate-100 bg-transparent focus:outline-none placeholder:text-slate-400 font-semibold"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="px-2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
          <button className="bg-red-700 hover:bg-red-800 text-white font-extrabold px-7 py-4 text-sm flex items-center gap-2 shrink-0 transition-colors shadow-sm">
            <Search className="w-4 h-4" />
            <span>Tìm kiếm</span>
          </button>
        </div>

        {/* Quick Filter Tags (Centered under search bar) */}
        <div className="flex items-center justify-center pt-1 text-xs">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {quickFilters.map((f) => (
              <button
                key={f.id}
                onClick={() => onSelectFilter(f.id)}
                className={`px-5 py-2 rounded-xl font-bold transition-all backdrop-blur-xs text-xs sm:text-sm ${
                  selectedFilter === f.id
                    ? 'bg-red-700 text-white font-extrabold shadow-sm border border-red-800'
                    : 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 shadow-2xs'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

