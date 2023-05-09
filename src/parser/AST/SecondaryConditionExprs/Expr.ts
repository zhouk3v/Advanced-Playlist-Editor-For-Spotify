export abstract class Expr {
  abstract evaluate(track: SpotifyApi.TrackObjectFull): boolean;
}
