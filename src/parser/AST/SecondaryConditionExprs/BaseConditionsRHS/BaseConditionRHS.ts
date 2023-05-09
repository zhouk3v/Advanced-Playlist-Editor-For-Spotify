// export interface BaseConditionRHS {
//   type: Number;
//   evaluate: (keyword: string, track: SpotifyApi.TrackObjectFull) => boolean;
// }

export abstract class BaseConditionRHS {
  type: Number;
  constructor(type: Number) {
    this.type = type;
  }

  abstract evaluate(
    keyword: string,
    track: SpotifyApi.TrackObjectFull
  ): boolean;
}
