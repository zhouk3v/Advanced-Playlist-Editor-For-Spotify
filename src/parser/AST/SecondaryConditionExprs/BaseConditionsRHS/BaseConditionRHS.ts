export interface BaseConditionRHS {
  type: Number;
  evaluate: (keyword: string, track: SpotifyApi.TrackObjectFull) => boolean;
}
