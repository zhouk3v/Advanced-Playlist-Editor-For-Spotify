import { EQUALS_CONDITION } from "../../../../../config";
import { BaseConditionRHS } from "./BaseConditionRHS";
import { TrackObject } from "../../../../../../API/fetchTracks";
class EqualsRHS extends BaseConditionRHS {
  term: string;
  constructor(term: string) {
    super(EQUALS_CONDITION);
    this.term = term;
  }
  evaluate(keyword: string, track: TrackObject): boolean {
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
