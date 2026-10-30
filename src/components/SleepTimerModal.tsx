import React, { useState } from 'react';
import { Moon, X, Clock, Play } from 'lucide-react';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sleepRemainingSeconds: number | null;
  onSetTimerMinutes: (minutes: number | null) => void;
}

const PRESET_DURATIONS = [15, 30, 45, 60, 90];

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({
  isOpen,
  onClose,
  sleepRemainingSeconds,
  onSetTimerMinutes
}) => {
  const [customInput, setCustomInput] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customInput, 10);
    if (!isNaN(val) && val > 0 && val <= 360) {
      onSetTimerMinutes(val);
      onClose();
    }
  };

  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Moon className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold tracking-tight text-white">Sleep Timer</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close sleep timer"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status if active */}
        {sleepRemainingSeconds !== null && (
          <div className="mt-4 p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-300 text-xs">
              <Clock className="w-4 h-4 animate-spin" />
              <span>Broadcast will stop in:</span>
            </div>
            <span className="font-mono tabular-nums text-sm font-semibold text-white">
              {formatTimeRemaining(sleepRemainingSeconds)}
            </span>
          </div>
        )}

        {/* Presets */}
        <div className="mt-4">
          <div className="text-xs font-medium text-slate-400 mb-2">Preset Durations</div>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_DURATIONS.map((mins) => (
              <button
                key={mins}
                onClick={() => {
                  onSetTimerMinutes(mins);
                  onClose();
                }}
                className="px-3 py-2.5 text-xs font-medium rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-indigo-600/30 hover:border-indigo-500/50 hover:text-white transition-colors"
              >
                {mins} Minutes
              </button>
            ))}
            <button
              onClick={() => {
                onSetTimerMinutes(null);
                onClose();
              }}
              className="px-3 py-2.5 text-xs font-medium rounded-lg bg-slate-800 border border-slate-700 text-rose-300 hover:bg-rose-950/40 hover:border-rose-800 transition-colors"
            >
              Turn Off
            </button>
          </div>
        </div>

        {/* Custom duration */}
        <form onSubmit={handleCustomSubmit} className="mt-5 pt-4 border-t border-slate-800">
          <div className="text-xs font-medium text-slate-400 mb-2">Custom Minutes</div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="360"
              placeholder="e.g. 20"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!customInput}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              Set
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
