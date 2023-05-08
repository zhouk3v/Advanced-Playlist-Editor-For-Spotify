export interface Expr {
  evaluate: (track: SpotifyApi.TrackObjectFull) => boolean;
}
