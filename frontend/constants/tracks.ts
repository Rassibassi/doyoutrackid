export interface ITrack {
  album: string;
  artist: string;
  label: string;
  played_datetime: string;
  release_date: string;
  song_link: string;
  timecode: string;
  title: string;
}

export interface ITrackResponse {
  message: string;
  tracks: ITrack[];
}
