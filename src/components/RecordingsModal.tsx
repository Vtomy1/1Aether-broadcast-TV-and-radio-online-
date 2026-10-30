import React from 'react';
import { Mic, X, Download, Trash2, Play, Music } from 'lucide-react';
import { RecordedClip } from '../types';

interface RecordingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordings: RecordedClip[];
  onDeleteRecording: (id: string) => void;
}

export const RecordingsModal: React.FC<RecordingsModalProps> = ({
  isOpen,
  onClose,
  recordings,
  onDeleteRecording
}) => {
  if (!isOpen) return null;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[80vh] text-slate-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <Mic className="w-5 h-5 text-rose-400" />
            <h2 className="text-base font-semibold tracking-tight text-white">Live Broadcast Recordings</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close recordings"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {recordings.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 mb-3">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-300">No broadcast recordings yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Click the red &quot;Record Snippet&quot; button while streaming any radio station to capture live audio clips.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recordings.map((clip) => (
                <div
                  key={clip.id}
                  className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">{clip.stationName}</div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                        <span>{clip.timestamp}</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatSeconds(clip.durationSeconds)} duration</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatBytes(clip.sizeBytes)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={clip.blobUrl}
                        download={`${clip.stationName.replace(/\s+/g, '_')}_${clip.id}.webm`}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 transition-colors"
                        title="Download audio recording"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => onDeleteRecording(clip.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete recording"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Built-in HTML5 player */}
                  <audio
                    controls
                    src={clip.blobUrl}
                    className="w-full h-8 rounded mt-1 bg-slate-900"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            {recordings.length} clip{recordings.length === 1 ? '' : 's'} recorded
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
