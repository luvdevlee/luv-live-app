export interface Streamer {
  id: string;
  userName: string;
  displayName: string;
  avatar: string;
  bio?: string;
  followers: number;
  isLive: boolean;
  streamTitle?: string;
  streamThumbnail?: string;
  category?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LiveStream {
  id: string;
  streamerId: string;
  title: string;
  description?: string;
  thumbnail: string;
  streamUrl: string;
  isLive: boolean;
  viewerCount: number;
  startedAt: Date;
  category: string;
  tags: string[];
}
