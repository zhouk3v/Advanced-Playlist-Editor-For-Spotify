import { IN_CONDITION } from "../../../config";
import { BaseConditionRHS } from "./BaseConditionRHS";
class InRHS implements BaseConditionRHS {
  type: Number;
  terms: Array<string>;
  constructor(terms: Array<string>) {
    this.type = IN_CONDITION;
    this.terms = terms;
  }
  evaluate(keyword: string, track: SpotifyApi.TrackObjectFull): boolean {
    const termSet = new Set(this.terms);
    switch (keyword) {
      case "artist":
        return (
          track.artists.find((artist) => termSet.has(artist.name)) !== undefined
        );
      case "album":
        return termSet.has(track.album.name);
      case "track":
        return termSet.has(track.name);
      default:
        return false;
    }
  }
}

export default InRHS;
