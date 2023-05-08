export interface Expr {
    evaluate: (track: SpotifyApi.TrackObjectSimplified) => boolean
}