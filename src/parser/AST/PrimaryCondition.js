class PrimaryCondition {
  constructor() {
    this.artist = [];
    this.album = [];
    this.track = [];
    this.playlist = [];
  }
  addCondition(type, terms) {
    switch (type) {
      case "artist":
        this.artist = this.artist.concat(terms).unique();
        break;
      case "album":
        this.album = this.album.concat(terms).unique();
        break;
      case "track":
        this.track = this.track.concat(terms).unique();
        break;
      case "playlist":
        this.playlist = this.playlist.concat(terms).unique();
        break;
      default:
        throw new Error("Invalid Keyword");
    }
  }
  toString() {
    let toReturn = "";
    toReturn = this._printCondition("artist", this.artist, toReturn);
    toReturn = this._printCondition("album", this.album, toReturn);
    toReturn = this._printCondition("track", this.track, toReturn);
    toReturn = this._printCondition("playlist", this.playlist, toReturn);
    return toReturn;
  }

  _printCondition(keyword, terms, toReturn) {
    if (this.terms.length) {
      if (toReturn.length > 0) {
        toReturn = `${toReturn} union `;
      }
      const termsStr = terms.join();
      toReturn = `${toReturn} ${keyword}:[${termsStr}]`;
    }
    return toReturn;
  }
}

export default PrimaryCondition;
