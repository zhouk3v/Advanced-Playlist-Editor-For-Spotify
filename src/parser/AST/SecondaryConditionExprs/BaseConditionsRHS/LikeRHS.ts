import { REGEX_CONDITION } from "../../../config";
import { BaseConditionRHS } from "./BaseConditionRHS";
class LikeRHS implements BaseConditionRHS {
  type: Number;
  term: string;
  constructor(term: string) {
    this.type = REGEX_CONDITION;
    this.term = term;
  }
  evaluate(keyword: string, track: SpotifyApi.TrackObjectFull): boolean {
    const regex = new RegExp(this.term);
    switch (keyword) {
      case "artist":
        return (
          track.artists.find((artist) => regex.test(artist.name)) !== undefined
        );
      case "album":
        return regex.test(track.album.name);
      case "track":
        return regex.test(track.name);
      default:
        return false;
    }
  }
}

export default LikeRHS;
