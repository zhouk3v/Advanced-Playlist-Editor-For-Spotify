import { EQUALS_CONDITION } from "../../../config";
import { BaseConditionRHS } from "./BaseConditionRHS";
class EqualsRHS implements BaseConditionRHS {
  type: Number;
  term: string;
  constructor(term: string) {
    this.type = EQUALS_CONDITION;
    this.term = term;
  }
  evaluate(keyword: string, track: SpotifyApi.TrackObjectFull): boolean {
    switch (keyword) {
      case "artist":
        return (
          track.artists.find((artist) => artist.name === this.term) !==
          undefined
        );
      case "album":
        return track.album.name === this.term;
      case "track":
        return track.name === this.term;
      default:
        return false;
    }
  }
}

export default EqualsRHS;
