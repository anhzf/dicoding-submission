import type { MessagingService } from '../messaging/types';
import type { PlaylistService } from '../playlist/types';

export interface PlaylistExportPluginOptions {
  playlistService: PlaylistService;
  messagingService: MessagingService;
}
