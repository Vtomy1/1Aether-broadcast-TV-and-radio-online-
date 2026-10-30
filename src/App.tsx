import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DEFAULT_STATIONS } from './data/defaultStations';
import { Station, ChannelCategory, RecordedClip, EqualizerPreset } from './types';
import { searchRadioBrowser } from './services/radioBrowserService';
import { TopNav } from './components/TopNav';
import { MediaPlayer } from './components/MediaPlayer';
import { ChannelGrid } from './components/ChannelGrid';
import { ScheduleDrawer } from './components/ScheduleDrawer';
import { EqualizerModal } from './components/EqualizerModal';
import { SleepTimerModal } from './components/SleepTimerModal';
import { CustomStreamModal } from './components/CustomStreamModal';
import { RecordingsModal } from './components/RecordingsModal';
import { Tv, Radio, Sparkles, Check, Info } from 'lucide-react';

const STORAGE_FAVORITES_KEY = 'aether_broadcast_favorites';
const STORAGE_CUSTOM_KEY = 'aether_broadcast_custom_stations';
const STORAGE_EQ_KEY = 'aether_broadcast_eq';

export default function App() {
  // Load custom stations
  const [customStations, setCustomStations] = useState<Station[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CUSTOM_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Load favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_FAVORITES_KEY);
      return stored ? JSON.parse(stored) : ['tv-dw-news', 'radio-somafm-groovesalad', 'radio-jazz24'];
    } catch {
      return ['tv-dw-news', 'radio-somafm-groovesalad'];
    }
  });

  // Remote discovered stations
  const [remoteStations, setRemoteStations] = useState<Station[]>([]);
  const [isSearchingRemote, setIsSearchingRemote] = useState<boolean>(false);

  // Combine stations
  const allStations = useMemo(() => {
    const combined = [...customStations, ...DEFAULT_STATIONS, ...remoteStations];
    // Remove duplicates by ID
    const seen = new Set<string>();
    return combined.filter((st) => {
      if (seen.has(st.id)) return false;
      seen.add(st.id);
      return true;
    });
  }, [customStations, remoteStations]);

  // Active playing station
  const [activeStation, setActiveStation] = useState<Station>(DEFAULT_STATIONS[0]);

  // Filter states
  const [mediaTab, setMediaTab] = useState<'all' | 'tv' | 'radio' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ChannelCategory>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  // Modals
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(false);
  const [scheduleStation, setScheduleStation] = useState<Station>(DEFAULT_STATIONS[0]);
  const [isEqualizerOpen, setIsEqualizerOpen] = useState<boolean>(false);
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState<boolean>(false);
  const [isAddStreamOpen, setIsAddStreamOpen] = useState<boolean>(false);
  const [isRecordingsOpen, setIsRecordingsOpen] = useState<boolean>(false);

  // Equalizer gains [60Hz, 250Hz, 1kHz, 4kHz, 14kHz]
  const [eqGains, setEqGains] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_EQ_KEY);
      return saved ? JSON.parse(saved) : [0, 0, 0, 0, 0];
    } catch {
      return [0, 0, 0, 0, 0];
    }
  });

  // Sleep timer in seconds
  const [sleepRemainingSeconds, setSleepRemainingSeconds] = useState<number | null>(null);

  // Recordings
  const [recordings, setRecordings] = useState<RecordedClip[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // storage unavailable
    }
  }, [favorites]);

  // Persist custom stations
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(customStations));
    } catch {
      // storage unavailable
    }
  }, [customStations]);

  // Persist EQ
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_EQ_KEY, JSON.stringify(eqGains));
    } catch {
      // storage unavailable
    }
  }, [eqGains]);

  // Show toast notification
  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Sleep timer interval
  useEffect(() => {
    if (sleepRemainingSeconds === null) return;

    if (sleepRemainingSeconds <= 0) {
      setSleepRemainingSeconds(null);
      triggerToast('Sleep timer reached. Broadcast stopped.');
      return;
    }

    const timer = setInterval(() => {
      setSleepRemainingSeconds((prev) => (prev !== null && prev > 0 ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [sleepRemainingSeconds, triggerToast]);

  const handleSetSleepTimerMinutes = (minutes: number | null) => {
    if (minutes === null) {
      setSleepRemainingSeconds(null);
      triggerToast('Sleep timer disabled');
    } else {
      setSleepRemainingSeconds(minutes * 60);
      triggerToast(`Sleep timer set to ${minutes} minutes`);
    }
  };

  const handleToggleFavorite = (station: Station) => {
    setFavorites((prev) => {
      const exists = prev.includes(station.id);
      if (exists) {
        triggerToast(`Removed "${station.name}" from favorites`);
        return prev.filter((id) => id !== station.id);
      } else {
        triggerToast(`Added "${station.name}" to favorites`);
        return [...prev, station.id];
      }
    });
  };

  const handleAddCustomStation = (newStation: Station) => {
    setCustomStations((prev) => [newStation, ...prev]);
    setActiveStation(newStation);
    triggerToast(`Added "${newStation.name}" to your broadcast lineup`);
  };

  const handleNewRecording = (clip: RecordedClip) => {
    setRecordings((prev) => [clip, ...prev]);
    triggerToast(`Audio clip recorded from ${clip.stationName}!`);
  };

  const handleDeleteRecording = (id: string) => {
    setRecordings((prev) => prev.filter((r) => r.id !== id));
    triggerToast('Recording deleted');
  };

  // Remote global directory search
  const handleSearchGlobalDirectory = async () => {
    const query = searchQuery.trim() || 'jazz';
    setIsSearchingRemote(true);
    triggerToast(`Searching 30,000+ open radio stations for "${query}"...`);
    try {
      const results = await searchRadioBrowser(query, 24);
      if (results.length > 0) {
        setRemoteStations(results);
        setMediaTab('radio');
        triggerToast(`Discovered ${results.length} live stations from global directory`);
      } else {
        triggerToast('No live stations found for this query in the directory.');
      }
    } catch {
      triggerToast('Could not reach public radio directory mirror.');
    } finally {
      setIsSearchingRemote(false);
    }
  };

  // Filtered station list
  const filteredStations = useMemo(() => {
    return allStations.filter((st) => {
      // Media type tab
      if (mediaTab === 'tv' && st.type !== 'tv') return false;
      if (mediaTab === 'radio' && st.type !== 'radio') return false;
      if (mediaTab === 'favorites' && !favorites.includes(st.id)) return false;

      // Category filter
      if (selectedCategory !== 'all' && st.category !== selectedCategory) return false;

      // Country filter
      if (selectedCountry !== 'all' && st.country !== selectedCountry) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = st.name.toLowerCase().includes(q);
        const matchesDesc = st.description.toLowerCase().includes(q);
        const matchesCountry = st.country.toLowerCase().includes(q);
        const matchesLang = st.language.toLowerCase().includes(q);
        const matchesCat = st.category.toLowerCase().includes(q);
        return matchesName || matchesDesc || matchesCountry || matchesLang || matchesCat;
      }

      return true;
    });
  }, [allStations, mediaTab, favorites, selectedCategory, selectedCountry, searchQuery]);

  // Open schedule guide for specific station
  const handleOpenScheduleForStation = (st: Station) => {
    setScheduleStation(st);
    setIsScheduleOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col antialiased selection:bg-sky-500 selection:text-slate-950">
      {/* Top Bar Contract Navigation */}
      <TopNav
        activeTab={mediaTab}
        onSelectTab={setMediaTab}
        onOpenAddStream={() => setIsAddStreamOpen(true)}
        onOpenRecordings={() => setIsRecordingsOpen(true)}
        onOpenGuide={() => handleOpenScheduleForStation(activeStation)}
        recordingsCount={recordings.length}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Player Viewport Anchor */}
        <section aria-label="Live Broadcast Player">
          <MediaPlayer
            station={activeStation}
            isFavorite={favorites.includes(activeStation.id)}
            onToggleFavorite={handleToggleFavorite}
            onOpenSchedule={() => handleOpenScheduleForStation(activeStation)}
            onOpenEqualizer={() => setIsEqualizerOpen(true)}
            onOpenSleepTimer={() => setIsSleepTimerOpen(true)}
            onNewRecording={handleNewRecording}
            sleepRemainingSeconds={sleepRemainingSeconds}
            eqGains={eqGains}
          />
        </section>

        {/* Channel Lineup & Directory */}
        <section aria-label="Channel Lineup and Station Explorer" className="pt-2">
          <ChannelGrid
            stations={filteredStations}
            activeStation={activeStation}
            onSelectStation={(st) => {
              setActiveStation(st);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onOpenSchedule={handleOpenScheduleForStation}
            activeMediaType={mediaTab}
            onChangeMediaType={setMediaTab}
            searchQuery={searchQuery}
            onChangeSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            onChangeCategory={setSelectedCategory}
            selectedCountry={selectedCountry}
            onChangeCountry={setSelectedCountry}
            isSearchingRemote={isSearchingRemote}
            onSearchGlobalRadioDirectory={handleSearchGlobalDirectory}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-950/80 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-200">Aether Broadcast</span>
            <span aria-hidden="true">·</span>
            <span>Online TV &amp; Radio Streaming System</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Adaptive HLS Video &amp; MP3 Direct</span>
            <span aria-hidden="true">·</span>
            <span>Audio Analyser Web Audio API</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ScheduleDrawer
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        station={scheduleStation}
      />

      <EqualizerModal
        isOpen={isEqualizerOpen}
        onClose={() => setIsEqualizerOpen(false)}
        gains={eqGains}
        onChangeGain={(bandIdx, gain) => {
          const updated = [...eqGains];
          updated[bandIdx] = gain;
          setEqGains(updated);
        }}
        onApplyPreset={(preset: EqualizerPreset) => setEqGains(preset.gains)}
        onReset={() => setEqGains([0, 0, 0, 0, 0])}
      />

      <SleepTimerModal
        isOpen={isSleepTimerOpen}
        onClose={() => setIsSleepTimerOpen(false)}
        sleepRemainingSeconds={sleepRemainingSeconds}
        onSetTimerMinutes={handleSetSleepTimerMinutes}
      />

      <CustomStreamModal
        isOpen={isAddStreamOpen}
        onClose={() => setIsAddStreamOpen(false)}
        onAddStation={handleAddCustomStation}
      />

      <RecordingsModal
        isOpen={isRecordingsOpen}
        onClose={() => setIsRecordingsOpen(false)}
        recordings={recordings}
        onDeleteRecording={handleDeleteRecording}
      />

      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-sky-500/50 shadow-2xl text-xs font-medium text-white animate-in slide-in-from-bottom-2 fade-in">
          <Info className="w-4 h-4 text-sky-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
