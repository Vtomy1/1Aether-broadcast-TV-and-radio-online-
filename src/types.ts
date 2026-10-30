export type MediaType = 'tv' | 'radio';

export type ChannelCategory =
  | 'all'
  | 'news'
  | 'music'
  | 'culture'
  | 'ambient'
  | 'talk'
  | 'nature'
  | 'sports';

export interface ScheduleItem {
  id: string;
  title: string;
  description: string;
  startHour: number; // 0 - 23
  startMinute: number;
  durationMinutes: number;
  host?: string;
  category?: string;
}

export interface Station {
  id: string;
  name: string;
  type: MediaType;
  category: ChannelCategory;
  country: string;
  countryCode: string; // ISO 2-letter
  language: string;
  streamUrl: string;
  backupStreamUrl?: string;
  logoUrl?: string;
  posterUrl?: string;
  description: string;
  bitrate?: string;
  quality?: string; // '1080p', '720p', 'Audio 192k'
  isHls?: boolean;
  website?: string;
  schedule?: ScheduleItem[];
  isCustom?: boolean;
}

export type VisualizerMode = 'bars' | 'wave' | 'circle' | 'spectrum';

export interface EqualizerPreset {
  name: string;
  gains: number[]; // 5 bands: 60Hz, 250Hz, 1kHz, 4kHz, 14kHz (in dB, -12 to +12)
}

export interface RecordedClip {
  id: string;
  stationName: string;
  stationType: MediaType;
  timestamp: string;
  durationSeconds: number;
  blobUrl: string;
  sizeBytes: number;
}
