import { EQUALS_CONDITION, IN_CONDITION, REGEX_CONDITION } from "../../config";

class BaseCondition {
  constructor(keyword, rhs) {
    this.keyword = keyword;
    this.type = rhs.type;
    this.term = rhs.term;
  }
  toString() {
    switch (this.type) {
      case EQUALS_CONDITION:
        return `${this.keyword} = ${this.term}`;
      case IN_CONDITION:
        const termsStr = this.term.join();
        return `${this.keyword} in (${termsStr})`;
      case REGEX_CONDITION:
        return `${this.keyword} like ${this.term}`;
      default:
        throw new Error("Invalid base condition");
    }
  }
  evaluate(track) {
    switch (this.type) {
      case EQUALS_CONDITION:
        return this._evaluateEquals(track);
      case IN_CONDITION:
        return this._evaluateIn(track);
      case REGEX_CONDITION:
        return this._evaluateLike(track);
      default:
        throw new Error("Invalid base condition");
    }
  }
  _evaluateEquals(track) {
    switch (this.keyword) {
      case "artist":
        return track.artists.find((artist) => artist.name === this.term);
      case "album":
        return track.album.name === this.term;
      case "track":
        return track.name === this.term;
      default:
        return false;
    }
  }
  _evaluateIn(track) {
    const termSet = new Set(this.term);
    switch (this.keyword) {
      case "artist":
        return track.artists.find((artist) => termSet.has(artist));
      case "album":
        return termSet.has(track.album.name);
      case "track":
        return termSet.has(track.name);
      default:
        return false;
    }
  }
  _evaluateLike(track) {
    const regex = new RegExp(this.term);
    switch (this.keyword) {
      case "artist":
        return track.artists.find((artist) => regex.test(artist.name));
      case "album":
        return regex.test(track.album.name);
      case "track":
        return regex.test(track.name);
      default:
        return false;
    }
  }
}

export default BaseCondition;
