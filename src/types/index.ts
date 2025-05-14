export interface AudioPlayerState {
  isPlaying: boolean;
  volume: number;
  isLoading: boolean;
  isError: boolean;
}

export interface RadioInfo {
  title: string;
  art: string;
  listeners: string;
  history: string[];
}