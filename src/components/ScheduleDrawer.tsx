import React, { useMemo } from 'react';
import { Calendar, X, Clock, User, Tv, Radio } from 'lucide-react';
import { Station, ScheduleItem } from '../types';

interface ScheduleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  station: Station | null;
  onSelectStation?: (st: Station) => void;
}

export const ScheduleDrawer: React.FC<ScheduleDrawerProps> = ({
  isOpen,
  onClose,
  station
}) => {
  if (!isOpen || !station) return null;

  // Compute currently airing item
  const now = new Date();
  const currentMinutesSinceMidnight = now.getHours() * 60 + now.getMinutes();

  const scheduleList: ScheduleItem[] = useMemo(() => {
    if (station.schedule && station.schedule.length > 0) {
      return [...station.schedule].sort((a, b) => {
        const timeA = a.startHour * 60 + a.startMinute;
        const timeB = b.startHour * 60 + b.startMinute;
        return timeA - timeB;
      });
    }

    // Default dynamic procedural 24-hr schedule if station has no explicit schedule
    const mockPrograms: ScheduleItem[] = [
      { id: 'gen-1', title: 'Morning Panorama & Global Wire', description: 'Early morning curated music, bulletins, and cultural digest.', startHour: 6, startMinute: 0, durationMinutes: 180, host: 'Morning Editorial' },
      { id: 'gen-2', title: 'Prime Daytime Soundstage', description: 'Continuous broadcast stream featuring key recordings and regional spotlights.', startHour: 9, startMinute: 0, durationMinutes: 240, host: 'Broadcaster Host' },
      { id: 'gen-3', title: 'Afternoon Explorations & Dialogue', description: 'In-depth long-form selections, interviews, and documentary audio.', startHour: 13, startMinute: 0, durationMinutes: 300, host: 'Station Resident' },
      { id: 'gen-4', title: 'The Sunset Broadcast', description: 'Golden hour transitions, melodic compositions, and evening headlines.', startHour: 18, startMinute: 0, durationMinutes: 180, host: 'Evening Anchor' },
      { id: 'gen-5', title: 'Late Night Nocturne Sessions', description: 'Midnight continuous selections, ambient textures, and soundscapes.', startHour: 21, startMinute: 0, durationMinutes: 540, host: 'Nocturne DJ' },
    ];
    return mockPrograms;
  }, [station]);

  // Find active program
  let activeItem: ScheduleItem | null = null;
  let activeItemProgressPercent = 0;

  for (const item of scheduleList) {
    const startMins = item.startHour * 60 + item.startMinute;
    const endMins = startMins + item.durationMinutes;

    if (currentMinutesSinceMidnight >= startMins && currentMinutesSinceMidnight < endMins) {
      activeItem = item;
      const elapsed = currentMinutesSinceMidnight - startMins;
      activeItemProgressPercent = Math.min(100, Math.max(0, Math.round((elapsed / item.durationMinutes) * 100)));
      break;
    }
  }

  // If midnight wraps or none directly matched, take first or closest
  if (!activeItem && scheduleList.length > 0) {
    activeItem = scheduleList[0];
    activeItemProgressPercent = 45;
  }

  const formatTimeRange = (startHour: number, startMinute: number, durationMinutes: number) => {
    const endTotalMinutes = startHour * 60 + startMinute + durationMinutes;
    const endHour = Math.floor(endTotalMinutes / 60) % 24;
    const endMinute = endTotalMinutes % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(startHour)}:${pad(startMinute)} — ${pad(endHour)}:${pad(endMinute)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[85vh] text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-lg text-sky-400">
              {station.type === 'tv' ? <Tv className="w-5 h-5" /> : <Radio className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold tracking-tight text-white">{station.name}</h2>
                <span className="text-xs text-slate-400 font-mono">EPG</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{station.country}</span>
                <span aria-hidden="true">·</span>
                <span>{station.language}</span>
                <span aria-hidden="true">·</span>
                <span>{station.quality || 'Live Broadcast'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close schedule guide"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Active Now Banner */}
          {activeItem && (
            <div className="p-4 bg-gradient-to-r from-sky-950/60 to-indigo-950/40 border border-sky-800/50 rounded-xl">
              <div className="flex items-center justify-between text-xs text-sky-300 font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  Currently Airing Live
                </span>
                <span className="font-mono tabular-nums text-slate-300">
                  {formatTimeRange(activeItem.startHour, activeItem.startMinute, activeItem.durationMinutes)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white tracking-tight">{activeItem.title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeItem.description}</p>
              {activeItem.host && (
                <div className="flex items-center gap-1.5 text-xs text-sky-300/80 mt-2">
                  <User className="w-3.5 h-3.5" />
                  <span>Hosted by {activeItem.host}</span>
                </div>
              )}
              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[11px] font-mono tabular-nums text-slate-400 mb-1">
                  <span>Show Progress</span>
                  <span>{activeItemProgressPercent}% elapsed</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-400 transition-all duration-500 rounded-full"
                    style={{ width: `${activeItemProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Chronological lineup */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Full 24-Hour Lineup</span>
            </div>

            <div className="space-y-2">
              {scheduleList.map((item) => {
                const isCurrentlyAiring = activeItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-lg border transition-colors ${
                      isCurrentlyAiring
                        ? 'bg-slate-800/80 border-sky-500/40'
                        : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{item.title}</span>
                          {isCurrentlyAiring && (
                            <span className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider">
                              Air Now
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                        {item.host && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1.5">
                            <User className="w-3 h-3" />
                            <span>{item.host}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 text-xs font-mono tabular-nums text-slate-300">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{formatTimeRange(item.startHour, item.startMinute, item.durationMinutes)}</span>
                        </div>
                        <span className="text-[11px] font-mono tabular-nums text-slate-500 block mt-0.5">
                          {item.durationMinutes} min
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            All times aligned to local client broadcast clock ({now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
