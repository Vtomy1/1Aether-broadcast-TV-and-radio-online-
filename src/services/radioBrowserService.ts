import { Station } from '../types';

// Free, open public endpoints for Radio Browser API
const RADIO_BROWSER_MIRRORS = [
  'https://de1.api.radio-browser.info',
  'https://nl1.api.radio-browser.info',
  'https://at1.api.radio-browser.info'
];

interface RawRadioBrowserStation {
  stationuuid: string;
  name: string;
  url_resolved: string;
  url: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  language: string;
  bitrate: number;
  codec: string;
}

export async function searchRadioBrowser(query: string, limit: number = 20): Promise<Station[]> {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = encodeURIComponent(query.trim());
  let lastError: Error | null = null;

  for (const mirror of RADIO_BROWSER_MIRRORS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(
        `${mirror}/json/stations/byname/${cleanQuery}?limit=${limit}&hidebroken=true&order=clickcount&reverse=true`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (!response.ok) continue;

      const data: RawRadioBrowserStation[] = await response.json();
      return data
        .filter(st => st.url_resolved && (st.url_resolved.startsWith('http://') || st.url_resolved.startsWith('https://')))
        .map(st => {
          let category: Station['category'] = 'music';
          const tagsLower = (st.tags || '').toLowerCase();
          if (tagsLower.includes('news')) category = 'news';
          else if (tagsLower.includes('talk')) category = 'talk';
          else if (tagsLower.includes('ambient') || tagsLower.includes('chill')) category = 'ambient';
          else if (tagsLower.includes('classical')) category = 'culture';
          else if (tagsLower.includes('sport')) category = 'sports';

          // Safe HTTPS conversion if available
          let streamUrl = st.url_resolved || st.url;
          if (streamUrl.startsWith('http://') && window.location.protocol === 'https:') {
            // Some streams support https on same path
            streamUrl = streamUrl.replace('http://', 'https://');
          }

          return {
            id: `rb-${st.stationuuid}`,
            name: st.name.trim(),
            type: 'radio',
            category,
            country: st.country || 'Global',
            countryCode: (st.countrycode || 'UN').toUpperCase(),
            language: st.language || 'English',
            streamUrl,
            backupStreamUrl: st.url !== streamUrl ? st.url : undefined,
            logoUrl: st.favicon || undefined,
            description: st.tags ? `Tags: ${st.tags.split(',').slice(0, 4).join(', ')}` : 'Global live internet radio station.',
            bitrate: st.bitrate ? `${st.bitrate} kbps ${st.codec || 'MP3'}` : `${st.codec || 'Live Audio'}`,
            quality: st.bitrate ? `${st.bitrate}k ${st.codec || ''}` : 'Live Stream',
            isHls: streamUrl.includes('.m3u8'),
            website: st.homepage || undefined
          };
        });
    } catch (err) {
      lastError = err as Error;
      // try next mirror
    }
  }

  console.warn('Radio Browser API lookup failed:', lastError);
  return [];
}
