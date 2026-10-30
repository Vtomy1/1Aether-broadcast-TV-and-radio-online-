import React, { useState } from 'react';
import {
  Search,
  Tv,
  Radio,
  Star,
  Globe,
  SlidersHorizontal,
  Grid,
  List,
  Play,
  RotateCcw,
  Sparkles,
  Calendar,
  Volume2
} from 'lucide-react';
import { Station, MediaType, ChannelCategory } from '../types';

interface ChannelGridProps {
  stations: Station[];
  activeStation: Station;
  onSelectStation: (station: Station) => void;
  favorites: string[];
  onToggleFavorite: (station: Station) => void;
  onOpenSchedule: (station: Station) => void;
  activeMediaType: 'all' | 'tv' | 'radio' | 'favorites';
  onChangeMediaType: (type: 'all' | 'tv' | 'radio' | 'favorites') => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
  selectedCategory: ChannelCategory;
  onChangeCategory: (cat: ChannelCategory) => void;
  selectedCountry: string;
  onChangeCountry: (country: string) => void;
  isSearchingRemote: boolean;
  onSearchGlobalRadioDirectory: () => void;
}

export const ChannelGrid: React.FC<ChannelGridProps> = ({
  stations,
  activeStation,
  onSelectStation,
  favorites,
  onToggleFavorite,
  onOpenSchedule,
  activeMediaType,
  onChangeMediaType,
  searchQuery,
  onChangeSearchQuery,
  selectedCategory,
  onChangeCategory,
  selectedCountry,
  onChangeCountry,
  isSearchingRemote,
  onSearchGlobalRadioDirectory
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Derive unique countries
  const countries = Array.from(new Set(stations.map((s) => s.country))).sort();

  const categories: { label: string; value: ChannelCategory }[] = [
    { label: 'All Categories', value: 'all' },
    { label: 'News & World', value: 'news' },
    { label: 'Music & Performance', value: 'music' },
    { label: 'Ambient & Lo-Fi', value: 'ambient' },
    { label: 'Culture & Classical', value: 'culture' },
    { label: 'Talk & Public Radio', value: 'talk' },
    { label: 'Nature & Space', value: 'nature' },
    { label: 'Sports', value: 'sports' }
  ];

  return (
    <div className="space-y-4">
      {/* Top Filter Bar: Media Tabs & View Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-slate-900 border border-slate-800 rounded-xl">
        {/* Media Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-lg shrink-0">
          <button
            onClick={() => onChangeMediaType('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeMediaType === 'all'
                ? 'bg-sky-500 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Streams
          </button>
          <button
            onClick={() => onChangeMediaType('tv')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeMediaType === 'tv'
                ? 'bg-sky-500 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            Live TV
          </button>
          <button
            onClick={() => onChangeMediaType('radio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeMediaType === 'radio'
                ? 'bg-sky-500 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Live Radio
          </button>
          <button
            onClick={() => onChangeMediaType('favorites')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeMediaType === 'favorites'
                ? 'bg-amber-400 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            Favorites ({favorites.length})
          </button>
        </div>

        {/* Search & Country controls */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search station, genre, city..."
              value={searchQuery}
              onChange={(e) => onChangeSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <select
            value={selectedCountry}
            onChange={(e) => onChangeCountry(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="all">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Grid / List switch */}
          <div className="flex items-center gap-0.5 p-1 bg-slate-950 border border-slate-800 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid layout"
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-slate-800 text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List layout"
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-slate-800 text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onChangeCategory(cat.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors border ${
              selectedCategory === cat.value
                ? 'bg-slate-800 border-sky-500/50 text-sky-300'
                : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {cat.label}
          </button>
        ))}

        {/* Global Directory Search Trigger */}
        <button
          onClick={onSearchGlobalRadioDirectory}
          disabled={isSearchingRemote}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap border border-indigo-700/50 bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/50 transition-colors ml-auto shrink-0"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{isSearchingRemote ? 'Querying Directory...' : 'Search Global Directory (30k+)'}</span>
        </button>
      </div>

      {/* Lineup Count & Metadata Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span>{stations.length} broadcast stations</span>
          {selectedCategory !== 'all' && (
            <>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{selectedCategory}</span>
            </>
          )}
          {selectedCountry !== 'all' && (
            <>
              <span aria-hidden="true">·</span>
              <span>{selectedCountry}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span>HLS / M3U8 &amp; MP3 Direct</span>
        </div>
      </div>

      {/* Stations List/Grid Rendering */}
      {stations.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/50 border border-slate-800 rounded-xl p-8">
          <SlidersHorizontal className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <h3 className="text-sm font-semibold text-white">No stations matched your filters</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try resetting your search query or search the global 30,000+ station directory for community streams.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                onChangeSearchQuery('');
                onChangeCategory('all');
                onChangeCountry('all');
                onChangeMediaType('all');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
            <button
              onClick={onSearchGlobalRadioDirectory}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              Search Global Directory
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stations.map((st) => {
            const isCurrent = activeStation.id === st.id;
            const isFav = favorites.includes(st.id);

            return (
              <div
                key={st.id}
                onClick={() => onSelectStation(st)}
                className={`group relative rounded-xl border p-4 cursor-pointer transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-slate-850 border-sky-500/80 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/50'
                    : 'bg-slate-900/80 border-slate-800/90 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Card Header: Media Type & Favorite Star */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`p-1.5 rounded-lg ${st.type === 'tv' ? 'bg-sky-500/10 text-sky-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                        {st.type === 'tv' ? <Tv className="w-3.5 h-3.5" /> : <Radio className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                        {st.type.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {isCurrent && (
                        <span className="flex items-center gap-1 text-[11px] font-mono text-sky-400 mr-1">
                          <Volume2 className="w-3 h-3 animate-pulse" />
                          <span>ON AIR</span>
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(st);
                        }}
                        aria-label="Toggle favorite"
                        className={`p-1 rounded-md transition-colors ${
                          isFav
                            ? 'text-amber-400 hover:text-amber-300'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Poster / Visual preview */}
                  <div className="relative aspect-video w-full rounded-lg bg-slate-950 border border-slate-800/80 overflow-hidden mb-3">
                    {st.posterUrl ? (
                      <img
                        src={st.posterUrl}
                        alt={st.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-slate-500">
                        {st.type === 'tv' ? <Tv className="w-7 h-7 mb-1" /> : <Radio className="w-7 h-7 mb-1" />}
                        <span className="text-[10px] font-mono tracking-wider">{st.quality || 'BROADCAST'}</span>
                      </div>
                    )}

                    {/* Hover play overlay */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Station Name & Description */}
                  <h4 className="text-sm font-semibold text-white tracking-tight group-hover:text-sky-300 transition-colors line-clamp-1">
                    {st.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {st.description}
                  </p>
                </div>

                {/* Card Footer: Metadata and EPG Guide trigger */}
                <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <span>{st.country}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-400">{st.quality || st.bitrate || 'Live'}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenSchedule(st);
                    }}
                    className="p-1 rounded text-slate-500 hover:text-sky-400 hover:bg-slate-800 transition-colors"
                    title="View Program Guide"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // List View
        <div className="border border-slate-800 rounded-xl divide-y divide-slate-800 overflow-hidden bg-slate-900/60">
          {stations.map((st) => {
            const isCurrent = activeStation.id === st.id;
            const isFav = favorites.includes(st.id);

            return (
              <div
                key={st.id}
                onClick={() => onSelectStation(st)}
                className={`p-3 sm:p-4 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                  isCurrent ? 'bg-slate-800/80 border-l-2 border-l-sky-400' : 'hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg shrink-0 ${st.type === 'tv' ? 'bg-sky-500/10 text-sky-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                    {st.type === 'tv' ? <Tv className="w-4 h-4" /> : <Radio className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white truncate">{st.name}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono text-sky-400 shrink-0">ON AIR</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 truncate mt-0.5">
                      <span>{st.country}</span>
                      <span aria-hidden="true">·</span>
                      <span>{st.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-400">{st.quality || st.bitrate || 'Online'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenSchedule(st);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="View EPG Schedule"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(st);
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isFav ? 'text-amber-400 hover:text-amber-300' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  <div className="w-8 h-8 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center justify-center transition-colors">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
