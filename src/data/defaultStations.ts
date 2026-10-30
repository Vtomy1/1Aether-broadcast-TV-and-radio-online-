import { Station } from '../types';

export const DEFAULT_STATIONS: Station[] = [
  // ================= LIVE TELEVISION CHANNELS =================
  {
    id: 'tv-dw-news',
    name: 'DW News Live',
    type: 'tv',
    category: 'news',
    country: 'Germany',
    countryCode: 'DE',
    language: 'English',
    streamUrl: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    backupStreamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    posterUrl: '/src/assets/images/tv_news_broadcast_1793325468781.jpg',
    description: 'International breaking news, investigative journalism, and global perspectives from Deutsche Welle.',
    quality: '1080p HD',
    isHls: true,
    website: 'https://www.dw.com',
    schedule: [
      { id: 'dw-1', title: 'DW News Global Edition', description: 'Comprehensive world news wrap-up with correspondents on five continents.', startHour: 6, startMinute: 0, durationMinutes: 60, host: 'Brent Goff' },
      { id: 'dw-2', title: 'The Day: Conflict & Diplomacy', description: 'Analysis of key geopolitical developments across Europe and Asia.', startHour: 7, startMinute: 0, durationMinutes: 60, host: 'Sarah Kelly' },
      { id: 'dw-3', title: 'Eco Africa & Global Environment', description: 'Field reports and conservation solutions battling climate shifts.', startHour: 8, startMinute: 0, durationMinutes: 30, host: 'Nneota Egbe' },
      { id: 'dw-4', title: 'Business Beyond: Market Pulse', description: 'Macro trends, tech disruption, and global energy market movements.', startHour: 8, startMinute: 30, durationMinutes: 30, host: 'Chelsey Dulaney' },
      { id: 'dw-5', title: 'DW News Hourly Live Broadcast', description: 'Live hourly updates on fast-moving breaking headlines around the globe.', startHour: 9, startMinute: 0, durationMinutes: 60, host: 'Phil Gay' },
      { id: 'dw-6', title: 'Documentary Special: The Architecture of Future Cities', description: 'Examining sustainable vertical megacities from Tokyo to Rotterdam.', startHour: 10, startMinute: 0, durationMinutes: 60 },
      { id: 'dw-7', title: 'DW Prime Time Global', description: 'In-depth interviews and headline debate from the Berlin broadcast desk.', startHour: 18, startMinute: 0, durationMinutes: 60, host: 'Melanie Hall' },
      { id: 'dw-8', title: 'Nightline International', description: 'Late edition news analysis and cultural features.', startHour: 22, startMinute: 0, durationMinutes: 60 }
    ]
  },
  {
    id: 'tv-france24-en',
    name: 'France 24 International',
    type: 'tv',
    category: 'news',
    country: 'France',
    countryCode: 'FR',
    language: 'English',
    streamUrl: 'https://france24.akamaized.net/hls/live/2032483/F24_EN_LO_HLS/master.m3u8',
    backupStreamUrl: 'https://stream.france24.com/hls/en/live.m3u8',
    posterUrl: '/src/assets/images/tv_news_broadcast_1793325468781.jpg',
    description: '24/7 global news channel broadcasting from Paris with special emphasis on African, European and Middle Eastern affairs.',
    quality: '720p HD',
    isHls: true,
    website: 'https://www.france24.com',
    schedule: [
      { id: 'f24-1', title: 'Live World News Bulletin', description: 'Live news reports on the hour from correspondents in Paris, Washington, and Tokyo.', startHour: 7, startMinute: 0, durationMinutes: 30 },
      { id: 'f24-2', title: 'The Paris Debate', description: 'Distinguished panellists dissect the biggest international political clashes.', startHour: 7, startMinute: 30, durationMinutes: 30, host: 'Francois Picard' },
      { id: 'f24-3', title: 'Eye on Africa', description: 'Comprehensive coverage of political shifts, culture, and startups across the African continent.', startHour: 8, startMinute: 0, durationMinutes: 30, host: 'Georja Calvin-Smith' },
      { id: 'f24-4', title: 'Tech 24: Innovations Redefining Tomorrow', description: 'Hands-on look at artificial intelligence, clean energy, and cyber frontiers.', startHour: 8, startMinute: 30, durationMinutes: 30, host: 'Peter O\'Brien' },
      { id: 'f24-5', title: 'Encore! Arts & Culture Review', description: 'Cinema, music, and international book releases reviewed in Paris.', startHour: 12, startMinute: 0, durationMinutes: 30 }
    ]
  },
  {
    id: 'tv-nasa-live',
    name: 'NASA TV Official Feed',
    type: 'tv',
    category: 'nature',
    country: 'United States',
    countryCode: 'US',
    language: 'English',
    streamUrl: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
    backupStreamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    posterUrl: '/src/assets/images/tv_nature_live_1793325468868.jpg',
    description: 'Direct high-definition live feeds from the International Space Station, planetary missions, rocket launches, and astronaut spacewalks.',
    quality: '1080p HD',
    isHls: true,
    website: 'https://www.nasa.gov',
    schedule: [
      { id: 'nasa-1', title: 'ISS Live Views & Earth Cam', description: 'Real-time high definition camera downlink over oceans, aurora borealis, and day/night terminators.', startHour: 0, startMinute: 0, durationMinutes: 120 },
      { id: 'nasa-2', title: 'Space Station Science Operations', description: 'Astronaut microgravity biology experiments, combustion science, and robotics maneuvers.', startHour: 9, startMinute: 0, durationMinutes: 90 },
      { id: 'nasa-3', title: 'Artemis & Deep Space Briefing', description: 'Lunar gateway assembly progress, Orion capsule telemetry, and rover development updates.', startHour: 14, startMinute: 0, durationMinutes: 60 },
      { id: 'nasa-4', title: 'James Webb Space Telescope Discoveries', description: 'Deep field spectroscopic reveals and exoplanet atmosphere analyses.', startHour: 19, startMinute: 0, durationMinutes: 60 }
    ]
  },
  {
    id: 'tv-redbull',
    name: 'Red Bull TV Extreme',
    type: 'tv',
    category: 'sports',
    country: 'Austria',
    countryCode: 'AT',
    language: 'English',
    streamUrl: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
    backupStreamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    posterUrl: '/src/assets/images/radio_electronic_club_1793325471066.jpg',
    description: 'High-octane extreme sports, downhill mountain biking, wingsuit flying, F1 racing behind the scenes, and breakdance world championships.',
    quality: '1080p HD',
    isHls: true,
    website: 'https://www.redbull.com/tv',
    schedule: [
      { id: 'rb-1', title: 'Red Bull Rampage: Utah Red Rocks', description: 'Freeride mountain bikers drop 70-foot cliffs in virgin sandstone terrain.', startHour: 10, startMinute: 0, durationMinutes: 120 },
      { id: 'rb-2', title: 'Formula 1 Paddock Stories', description: 'Race engineers and pit crews reveal the razor-thin margin of victory.', startHour: 14, startMinute: 0, durationMinutes: 60 },
      { id: 'rb-3', title: 'Way of the Wildcard: Big Wave Surfing', description: 'Chasing 80-foot swells at Nazaré, Portugal with the world elite paddle team.', startHour: 17, startMinute: 0, durationMinutes: 90 },
      { id: 'rb-4', title: 'BC One World Final Cyphers', description: 'The planet’s top B-Boys and B-Girls face off in explosive 1-on-1 battle rounds.', startHour: 20, startMinute: 0, durationMinutes: 120 }
    ]
  },
  {
    id: 'tv-euronews',
    name: 'Euronews HD',
    type: 'tv',
    category: 'news',
    country: 'European Union',
    countryCode: 'EU',
    language: 'English',
    streamUrl: 'https://euronews-euronews-world-1-au.samsung.wurl.tv/playlist.m3u8',
    backupStreamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    posterUrl: '/src/assets/images/tv_news_broadcast_1793325468781.jpg',
    description: 'All-views perspective on European policies, international diplomacy, world markets, and pan-continental innovations.',
    quality: '1080p HD',
    isHls: true,
    website: 'https://www.euronews.com',
    schedule: [
      { id: 'en-1', title: 'Euronews Now Morning', description: 'Pan-European morning headlines from Brussels, Strasbourg, and London.', startHour: 7, startMinute: 0, durationMinutes: 60 },
      { id: 'en-2', title: 'State of the Union', description: 'European parliamentary decisions, trade alignments, and defense updates.', startHour: 11, startMinute: 0, durationMinutes: 30 },
      { id: 'en-3', title: 'No Comment Raw Feed', description: 'Unedited, voice-free high definition footage of today\'s raw historical events.', startHour: 13, startMinute: 0, durationMinutes: 15 },
      { id: 'en-4', title: 'Global Conversation', description: 'Long-form encounters with world leaders, innovators, and humanitarians.', startHour: 19, startMinute: 30, durationMinutes: 30 }
    ]
  },
  {
    id: 'tv-nature-cam',
    name: 'WildEarth & Oceans HD',
    type: 'tv',
    category: 'nature',
    country: 'South Africa',
    countryCode: 'ZA',
    language: 'English',
    streamUrl: 'https://amg01269-cinedigm-realstories-samsungus-e2l3t.amagi.tv/playlist/amg01269-cinedigm-realstories-samsungus/playlist.m3u8',
    backupStreamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    posterUrl: '/src/assets/images/tv_nature_live_1793325468868.jpg',
    description: 'Immersive 24/7 nature safaris, coral reef explorations, and live wilderness telemetry from pristine national reserves.',
    quality: '1080p HD',
    isHls: true,
    website: 'https://wildearth.tv',
    schedule: [
      { id: 'nat-1', title: 'Sunrise African Bush Safari', description: 'Expert game rangers track pride of lions and elephant herds in the Greater Kruger.', startHour: 5, startMinute: 30, durationMinutes: 180 },
      { id: 'nat-2', title: 'Deep Ocean Coral Reef Explorers', description: 'Hydrophone recordings and ultra HD underwater live cameras in the Indo-Pacific.', startHour: 11, startMinute: 0, durationMinutes: 120 },
      { id: 'nat-3', title: 'Sunset Waterhole Gathering', description: 'Watching cheetahs, giraffes, and waterbirds converge at golden sunset.', startHour: 16, startMinute: 0, durationMinutes: 180 }
    ]
  },
  {
    id: 'tv-rtve-24h',
    name: 'RTVE Canal 24 Horas',
    type: 'tv',
    category: 'news',
    country: 'Spain',
    countryCode: 'ES',
    language: 'Spanish',
    streamUrl: 'https://rtvelivestream.akamaized.net/rtvesec/24h/24h_main_500.m3u8',
    backupStreamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    posterUrl: '/src/assets/images/tv_news_broadcast_1793325468781.jpg',
    description: 'Continuous news, political debate, culture, and sports coverage from Spain and Latin America.',
    quality: '720p HD',
    isHls: true,
    website: 'https://www.rtve.es/noticias',
    schedule: [
      { id: 'rtve-1', title: 'Telediario Matinal', description: 'Primera edición de noticias, economía y estado del tiempo.', startHour: 7, startMinute: 0, durationMinutes: 60 },
      { id: 'rtve-2', title: 'La Noche en 24 Horas', description: 'Análisis político, mesas de debate e investigación periodística.', startHour: 22, startMinute: 0, durationMinutes: 90 }
    ]
  },
  {
    id: 'tv-mux-cinema',
    name: 'CineStream Open 4K Showcase',
    type: 'tv',
    category: 'culture',
    country: 'International',
    countryCode: 'UN',
    language: 'English',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    posterUrl: '/src/assets/images/tv_nature_live_1793325468868.jpg',
    description: 'High-bitrate reference cinematographic stream running 60fps adaptive multi-rate demonstration reels and animation masterpieces.',
    quality: '1080p 60fps',
    isHls: true,
    website: 'https://mux.com',
    schedule: [
      { id: 'cine-1', title: 'Open Source Cinema Showcase', description: 'Blender Foundation animated epics rendered in pristine 4K color space.', startHour: 12, startMinute: 0, durationMinutes: 90 },
      { id: 'cine-2', title: 'Acoustic Soundstage Concerts', description: 'Live orchestral and multi-track audio mastering demonstration sessions.', startHour: 20, startMinute: 0, durationMinutes: 120 }
    ]
  },

  // ================= LIVE RADIO STATIONS =================
  {
    id: 'radio-somafm-groovesalad',
    name: 'SomaFM: Groove Salad',
    type: 'radio',
    category: 'ambient',
    country: 'United States',
    countryCode: 'US',
    language: 'English',
    streamUrl: 'https://ice1.somafm.com/groovesalad-128-mp3',
    backupStreamUrl: 'https://ice2.somafm.com/groovesalad-128-mp3',
    posterUrl: '/src/assets/images/radio_electronic_club_1793325471066.jpg',
    description: 'A nicely chilled plate of ambient/downtempo beats and grooves. Broadcaster icon from San Francisco running commercial-free since 2000.',
    bitrate: '128 kbps MP3',
    quality: 'Lossless Studio Stream',
    isHls: false,
    website: 'https://somafm.com/groovesalad',
    schedule: [
      { id: 'gs-1', title: 'Deep Downtempo Horizon', description: 'Hypnotic chill beats, warm Rhodes chords, and ambient textures for deep focus.', startHour: 6, startMinute: 0, durationMinutes: 360, host: 'Rusty Hodge' },
      { id: 'gs-2', title: 'Midday Velvet Grooves', description: 'Lo-fi downtempo, French electronica, and cinematic beats to power through the afternoon.', startHour: 12, startMinute: 0, durationMinutes: 360 },
      { id: 'gs-3', title: 'Late Night Chill Cafe', description: 'Warm ethereal synthesizers, dub echoes, and minimalist chillout sessions.', startHour: 22, startMinute: 0, durationMinutes: 480 }
    ]
  },
  {
    id: 'radio-jazz24',
    name: 'Jazz24 Seattle & Tacoma',
    type: 'radio',
    category: 'music',
    country: 'United States',
    countryCode: 'US',
    language: 'English',
    streamUrl: 'https://kplu.streamguys1.com/kplu2',
    backupStreamUrl: 'https://ice1.somafm.com/sonicuniverse-128-mp3',
    posterUrl: '/src/assets/images/radio_jazz_lounge_1793325471373.jpg',
    description: 'The greatest jazz ever recorded, 24 hours a day. Miles Davis, John Coltrane, Ella Fitzgerald, Dave Brubeck, and contemporary virtuosos.',
    bitrate: '128 kbps MP3',
    quality: 'Pristine Hi-Fi Jazz',
    isHls: false,
    website: 'https://www.jazz24.org',
    schedule: [
      { id: 'j24-1', title: 'Morning Jazz Standards', description: 'Swinging brass, cool West Coast jazz, and timeless Blue Note classics.', startHour: 8, startMinute: 0, durationMinutes: 240, host: 'Dick Stein' },
      { id: 'j24-2', title: 'Midday Bop & Hard Bop Sessions', description: 'The legendary hard bop quintets of the 1950s and 60s in full acoustic glory.', startHour: 13, startMinute: 0, durationMinutes: 240, host: 'Robin Lloyd' },
      { id: 'j24-3', title: 'Midnight Velvet Club: Modal & Ballads', description: 'Muted trumpet, brushed snare drums, and smoky late-night jazz improvisations.', startHour: 22, startMinute: 0, durationMinutes: 300, host: 'Abe Beeson' }
    ]
  },
  {
    id: 'radio-kexp-seattle',
    name: 'KEXP 90.3 FM Seattle',
    type: 'radio',
    category: 'music',
    country: 'United States',
    countryCode: 'US',
    language: 'English',
    streamUrl: 'https://kexp.streamguys1.com/kexp128.mp3',
    posterUrl: '/src/assets/images/radio_electronic_club_1793325471066.jpg',
    description: 'Where the music matters. World-renowned champion of independent music, post-punk, electronic, global beats, and live in-studio sessions.',
    bitrate: '128 kbps MP3',
    quality: 'Live Broadcast FM',
    isHls: false,
    website: 'https://www.kexp.org',
    schedule: [
      { id: 'kexp-1', title: 'The Morning Show with John Richards', description: 'You are not alone. Inspiring indie anthems, energetic morning discoveries, and emotional depth.', startHour: 6, startMinute: 0, durationMinutes: 240, host: 'John Richards' },
      { id: 'kexp-2', title: 'The Midday Show with Cheryl Waters', description: 'Curated indie rock, live session archive premieres, and deep music exploration.', startHour: 10, startMinute: 0, durationMinutes: 240, host: 'Cheryl Waters' },
      { id: 'kexp-3', title: 'Drive Time with Kevin Cole', description: 'Fast-paced post-punk, global dance, synth-pop, and garage rock to finish your day.', startHour: 14, startMinute: 0, durationMinutes: 240, host: 'Kevin Cole' },
      { id: 'kexp-4', title: 'Sonic Reducer: Underground Sound', description: 'Raw punk, noise rock, hardcore, and uncompromising alternative soundscapes.', startHour: 21, startMinute: 0, durationMinutes: 180 }
    ]
  },
  {
    id: 'radio-radioparadise-main',
    name: 'Radio Paradise: Main Mix',
    type: 'radio',
    category: 'music',
    country: 'United States',
    countryCode: 'US',
    language: 'English',
    streamUrl: 'https://stream.radioparadise.com/mp3-192',
    backupStreamUrl: 'https://stream.radioparadise.com/mellow-192',
    posterUrl: '/src/assets/images/radio_jazz_lounge_1793325471373.jpg',
    description: 'Listener-supported commercial-free internet radio blending modern rock, classical, electronica, world music, and acoustic songcraft.',
    bitrate: '192 kbps MP3',
    quality: 'Audiophile Grade',
    isHls: false,
    website: 'https://radioparadise.com',
    schedule: [
      { id: 'rp-1', title: 'Eclectic Morning Continuum', description: 'Seamless non-stop acoustic blending into modern indie and classic art rock.', startHour: 6, startMinute: 0, durationMinutes: 360, host: 'Bill Goldsmith' },
      { id: 'rp-2', title: 'The Golden Hour Flow', description: 'Dream pop, folk rock, fingerstyle guitar, and trip-hop transitions without interruption.', startHour: 16, startMinute: 0, durationMinutes: 300, host: 'Rebecca Goldsmith' }
    ]
  },
  {
    id: 'radio-somafm-dronezone',
    name: 'SomaFM: Drone Zone',
    type: 'radio',
    category: 'ambient',
    country: 'United States',
    countryCode: 'US',
    language: 'English',
    streamUrl: 'https://ice1.somafm.com/dronezone-128-mp3',
    posterUrl: '/src/assets/images/tv_nature_live_1793325468868.jpg',
    description: 'Served best chilled, safe with most medications. Atmospheric ambient space music with deep resonant drones and subtle textures.',
    bitrate: '128 kbps MP3',
    quality: 'Deep Focus Soundscape',
    isHls: false,
    website: 'https://somafm.com/dronezone',
    schedule: [
      { id: 'dz-1', title: 'Deep Space Drones & Astral Resonance', description: 'Continuous evolving modular synthesizers and harmonic space frequencies.', startHour: 0, startMinute: 0, durationMinutes: 720 },
      { id: 'dz-2', title: 'Sub-Bass Meditative Waves', description: 'Slow-motion sonic immersion for coding, sleep, relaxation, and deep mindfulness.', startHour: 12, startMinute: 0, durationMinutes: 720 }
    ]
  },
  {
    id: 'radio-classicfm-uk',
    name: 'Classic FM UK',
    type: 'radio',
    category: 'culture',
    country: 'United Kingdom',
    countryCode: 'GB',
    language: 'English',
    streamUrl: 'https://media-ice.musicradio.com/ClassicFMMP3',
    posterUrl: '/src/assets/images/radio_jazz_lounge_1793325471373.jpg',
    description: 'The world\'s greatest classical music. Beethoven, Mozart, Bach, Chopin, and cinematic orchestral film scores from London.',
    bitrate: '128 kbps MP3',
    quality: 'Concert Hall Audio',
    isHls: false,
    website: 'https://www.classicfm.com',
    schedule: [
      { id: 'cfm-1', title: 'Classic FM Breakfast with Tim Lihoreau', description: 'Bright uplifting symphonies, concertos, and delightful morning music puzzles.', startHour: 6, startMinute: 0, durationMinutes: 180, host: 'Tim Lihoreau' },
      { id: 'cfm-2', title: 'The Hall of Fame Hour', description: 'The definitive countdown of the world\'s 300 favourite classical works.', startHour: 13, startMinute: 0, durationMinutes: 120, host: 'Alexander Armstrong' },
      { id: 'cfm-3', title: 'Smooth Classics at Seven', description: 'Relaxing strings, gentle piano nocturnes, and tranquil choral pieces.', startHour: 19, startMinute: 0, durationMinutes: 180, host: 'Margherita Taylor' }
    ]
  },
  {
    id: 'radio-ibiza-global',
    name: 'Ibiza Global Radio',
    type: 'radio',
    category: 'music',
    country: 'Spain',
    countryCode: 'ES',
    language: 'Spanish',
    streamUrl: 'https://listens.ibizaglobalradio.com:8024/stream',
    posterUrl: '/src/assets/images/radio_electronic_club_1793325471066.jpg',
    description: 'Direct audio stream from the White Isle of Ibiza. Deep melodic house, sunset Balearic grooves, and live sets from world-class DJs.',
    bitrate: '128 kbps MP3',
    quality: 'Balearic Sunset Audio',
    isHls: false,
    website: 'https://ibizaglobalradio.com',
    schedule: [
      { id: 'igr-1', title: 'Café Mambo Sunset Sessions', description: 'Chilled Balearic beats and beachside vocal house as the Mediterranean sun sets.', startHour: 18, startMinute: 0, durationMinutes: 120 },
      { id: 'igr-2', title: 'Ibiza Club Night Resident Mix', description: 'Underground tech house and melodic techno live from the island\'s iconic clubs.', startHour: 23, startMinute: 0, durationMinutes: 300 }
    ]
  },
  {
    id: 'radio-fip-paris',
    name: 'FIP Radio Paris',
    type: 'radio',
    category: 'culture',
    country: 'France',
    countryCode: 'FR',
    language: 'French',
    streamUrl: 'https://icecast.radiofrance.fr/fip-midfi.mp3',
    posterUrl: '/src/assets/images/radio_jazz_lounge_1793325471373.jpg',
    description: 'Radio France’s legendary musical tapestry. Eclectic seamless transitions without commercials between jazz, funk, world, rock, and chanson.',
    bitrate: '128 kbps MP3',
    quality: 'Eclectic Parisian Feed',
    isHls: false,
    website: 'https://www.radiofrance.fr/fip',
    schedule: [
      { id: 'fip-1', title: 'La Sélection Musicale de FIP', description: 'Curated by the most discerning music programmers in Paris: jazz, soul, bossa nova, and indie discoveries.', startHour: 7, startMinute: 0, durationMinutes: 480 },
      { id: 'fip-2', title: 'Club Jazzafip', description: 'Rare jazz pressings, live Montreux recordings, and Afro-Cuban rhythms.', startHour: 19, startMinute: 0, durationMinutes: 120 }
    ]
  },
  {
    id: 'radio-wnyc-fm',
    name: 'WNYC 93.9 FM New York',
    type: 'radio',
    category: 'talk',
    country: 'United States',
    countryCode: 'US',
    language: 'English',
    streamUrl: 'https://fm939.wnyc.org/wnycfm',
    posterUrl: '/src/assets/images/tv_news_broadcast_1793325468781.jpg',
    description: 'New York’s premier public radio station. Thought-provoking journalism, cultural conversations, NPR programming, and local city life.',
    bitrate: '128 kbps MP3',
    quality: 'NPR & New York Talk',
    isHls: false,
    website: 'https://www.wnyc.org',
    schedule: [
      { id: 'wnyc-1', title: 'Morning Edition', description: 'NPR national reporting and WNYC New York metro news and commuting context.', startHour: 6, startMinute: 0, durationMinutes: 180, host: 'Michael Hill' },
      { id: 'wnyc-2', title: 'The Brian Lehrer Show', description: 'Live caller dialogue on municipal affairs, national elections, and civic health.', startHour: 10, startMinute: 0, durationMinutes: 120, host: 'Brian Lehrer' },
      { id: 'wnyc-3', title: 'All Of It with Alison Stewart', description: 'Conversations with Broadway playwrights, novelists, chefs, and visual artists.', startHour: 12, startMinute: 0, durationMinutes: 120, host: 'Alison Stewart' },
      { id: 'wnyc-4', title: 'All Things Considered', description: 'Award-winning evening newsmagazine examining world affairs in depth.', startHour: 16, startMinute: 0, durationMinutes: 180 }
    ]
  },
  {
    id: 'radio-somafm-indiepop',
    name: 'SomaFM: Indie Pop Rocks!',
    type: 'radio',
    category: 'music',
    country: 'United States',
    countryCode: 'US',
    language: 'English',
    streamUrl: 'https://ice1.somafm.com/indiepop-128-mp3',
    posterUrl: '/src/assets/images/radio_electronic_club_1793325471066.jpg',
    description: 'New and classic favorite indie pop tracks with just a bit of rock. Discover tomorrow’s college radio gems today.',
    bitrate: '128 kbps MP3',
    quality: 'Indie Radio',
    isHls: false,
    website: 'https://somafm.com/indiepop',
    schedule: [
      { id: 'ipr-1', title: 'Jangle Pop & Garage Melodies', description: 'Upbeat jangly guitars, dream pop harmonies, and punchy hooks.', startHour: 8, startMinute: 0, durationMinutes: 300 },
      { id: 'ipr-2', title: 'Post-Punk Revival & Shoegaze', description: 'Swirling reverb pedals, motorik drum beats, and moody vocal melodies.', startHour: 17, startMinute: 0, durationMinutes: 240 }
    ]
  },
  {
    id: 'radio-bbc-worldservice',
    name: 'BBC World Service',
    type: 'radio',
    category: 'news',
    country: 'United Kingdom',
    countryCode: 'GB',
    language: 'English',
    streamUrl: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service',
    posterUrl: '/src/assets/images/tv_news_broadcast_1793325468781.jpg',
    description: 'Authoritative international news, human interest features, science dispatch, and global debate from BBC London.',
    bitrate: '128 kbps MP3',
    quality: 'Global BBC Service',
    isHls: false,
    website: 'https://www.bbc.co.uk/worldservice',
    schedule: [
      { id: 'bbc-1', title: 'Newshour Live', description: 'The world’s flagship international radio news programme with unmatched ground reporting.', startHour: 13, startMinute: 0, durationMinutes: 60, host: 'Julian Marshall' },
      { id: 'bbc-2', title: 'The Inquiry: Burning Questions', description: 'Four expert witnesses dissect one urgent global problem.', startHour: 16, startMinute: 0, durationMinutes: 30 },
      { id: 'bbc-3', title: 'Discovery: Science Frontiers', description: 'Explorations in quantum mechanics, evolutionary biology, and astrophysics.', startHour: 20, startMinute: 0, durationMinutes: 30 }
    ]
  },
  {
    id: 'radio-lofi-beats',
    name: 'Lo-Fi Chillhop Broadcast',
    type: 'radio',
    category: 'ambient',
    country: 'Germany',
    countryCode: 'DE',
    language: 'Instrumental',
    streamUrl: 'https://streams.ilovemusic.de/iloveradio17.mp3',
    posterUrl: '/src/assets/images/radio_electronic_club_1793325471066.jpg',
    description: '24/7 peaceful lo-fi hip hop study beats, vinyl crackles, warm cassette tape saturation, and mellow piano chords.',
    bitrate: '192 kbps MP3',
    quality: 'Study & Sleep Beats',
    isHls: false,
    website: 'https://ilovemusic.de',
    schedule: [
      { id: 'lofi-1', title: 'Late Night Coffee & Rainy Streets', description: 'Gentle rainy day beats with melancholic chords and vinyl flutter.', startHour: 0, startMinute: 0, durationMinutes: 720 },
      { id: 'lofi-2', title: 'Sunny Afternoon Desk Session', description: 'Uplifting jazzy boom-bap rhythms and Rhodes pianos for high productivity.', startHour: 12, startMinute: 0, durationMinutes: 720 }
    ]
  }
];
