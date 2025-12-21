export interface LanyardResponse {
  success: boolean;
  data: LanyardData | null;
}

export interface LanyardData {
  active_on_discord_mobile: boolean;
  active_on_discord_desktop: boolean;
  listening_to_spotify: boolean;
  kv?: Record<string, any>;
  spotify?: Spotify | null;
  discord_user: DiscordUser;
  discord_status: string;
  activities: Activity[];
  [key: string]: any;
}

export interface Spotify {
  track_id: string;
  timestamps: SpotifyTimestamps;
  song: string;
  artist: string;
  album_art_url: string;
  album: string;
  [key: string]: any;
}

export interface SpotifyTimestamps {
  start: number;
  end: number;
}

export interface DiscordUser {
  username: string;
  public_flags: number;
  id: string;
  discriminator: string;
  avatar: string | null;
  [key: string]: any;
}

export interface Activity {
  type: number;
  timestamps?: ActivityTimestamps;
  sync_id?: string | null;
  state?: string | null;
  session_id?: string | null;
  party?: Party | null;
  name: string;
  id: string;
  flags?: number;
  details?: string | null;
  created_at?: number;
  assets?: ActivityAssets;
  application_id?: string;
  [key: string]: any;
}

export interface ActivityTimestamps {
  start?: number;
  end?: number;
}

export interface Party {
  id?: string;
}

export interface ActivityAssets {
  large_text?: string;
  large_image?: string;
  small_text?: string;
  small_image?: string;
}
