import React from 'react';
import { Plus, Tv, Radio, Mic, Star, Calendar } from 'lucide-react';

interface TopNavProps {
  activeTab: 'all' | 'tv' | 'radio' | 'favorites';
  onSelectTab: (tab: 'all' | 'tv' | 'radio' | 'favorites') => void;
  onOpenAddStream: () => void;
  onOpenRecordings: () => void;
  onOpenGuide: () => void;
  recordingsCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddStream,
  onOpenRecordings,
  onOpenGuide,
  recordingsCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('all');
          }}
          className="text-lg font-bold tracking-tight text-white hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span>Aether Broadcast</span>
        </a>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectTab('tv')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'tv' ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>Live TV</span>
          </button>
          <button
            onClick={() => onSelectTab('radio')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'radio' ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Live Radio</span>
          </button>
          <button
            onClick={onOpenGuide}
            className="transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-slate-400 hover:text-white"
          >
            <Calendar className="w-4 h-4" />
            <span>Program Guide</span>
          </button>
          <button
            onClick={onOpenRecordings}
            className="transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-slate-400 hover:text-white"
          >
            <Mic className="w-4 h-4 text-rose-400" />
            <span>Recordings {recordingsCount > 0 ? `(${recordingsCount})` : ''}</span>
          </button>
          <button
            onClick={() => onSelectTab('favorites')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'favorites' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Star className="w-4 h-4 text-amber-400" />
            <span>Favorites</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenAddStream}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg shadow-sm shadow-sky-500/20 transition-all active:scale-95 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Stream</span>
          </button>
        </div>
      </div>
    </header>
  );
};
