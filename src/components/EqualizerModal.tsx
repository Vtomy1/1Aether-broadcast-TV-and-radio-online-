import React from 'react';
import { Sliders, X, RotateCcw } from 'lucide-react';
import { EqualizerPreset } from '../types';

export const EQ_PRESETS: EqualizerPreset[] = [
  { name: 'Flat', gains: [0, 0, 0, 0, 0] },
  { name: 'Bass Boost', gains: [6, 4, 0, -1, -2] },
  { name: 'Vocal Enhancer', gains: [-2, 1, 5, 3, 0] },
  { name: 'Electronic', gains: [5, 3, -1, 3, 5] },
  { name: 'Acoustic / Jazz', gains: [2, 1, 2, 3, 2] },
  { name: 'Rock', gains: [4, 2, -1, 3, 4] }
];

export const FREQ_LABELS = ['60 Hz', '250 Hz', '1 kHz', '4 kHz', '14 kHz'];

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  gains: number[];
  onChangeGain: (bandIndex: number, gain: number) => void;
  onApplyPreset: (preset: EqualizerPreset) => void;
  onReset: () => void;
}

export const EqualizerModal: React.FC<EqualizerModalProps> = ({
  isOpen,
  onClose,
  gains,
  onChangeGain,
  onApplyPreset,
  onReset
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-semibold tracking-tight text-white">Audio Equalizer & DSP</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close equalizer"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets */}
        <div className="mt-5">
          <div className="text-xs font-medium text-slate-400 mb-2">Sound Profiles</div>
          <div className="grid grid-cols-3 gap-2">
            {EQ_PRESETS.map((preset) => {
              const isMatch = preset.gains.every((val, idx) => val === gains[idx]);
              return (
                <button
                  key={preset.name}
                  onClick={() => onApplyPreset(preset)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                    isMatch
                      ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5-Band Sliders */}
        <div className="mt-6 p-4 bg-slate-950/70 border border-slate-850 rounded-xl">
          <div className="flex items-end justify-between gap-4 h-44 pb-2">
            {gains.map((gain, index) => (
              <div key={FREQ_LABELS[index]} className="flex-1 flex flex-col items-center h-full justify-between">
                <span className="text-xs font-mono tabular-nums text-slate-400">
                  {gain > 0 ? `+${gain}` : gain}dB
                </span>
                <div className="relative flex items-center justify-center h-28 w-full">
                  <input
                    type="range"
                    min={-12}
                    max={12}
                    step={1}
                    value={gain}
                    onChange={(e) => onChangeGain(index, Number(e.target.value))}
                    className="h-28 -rotate-90 w-28 appearance-none bg-transparent cursor-pointer accent-sky-400"
                  />
                </div>
                <span className="text-xs font-medium text-slate-300 text-center">
                  {FREQ_LABELS[index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer controls */}
        <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Flat
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
