class PrimaryConditions {
  constructor() {
    this.artist = [];
    this.album = [];
    this.track = [];
    this.playlist = [];
  }

  addConditions(conditions) {
    conditions.forEach((condition) => {
      this.addCondition(condition);
    });
  }

  addCondition(condition) {
    switch (condition.type) {
      case "artist":
        this.artist.push(condition.name);
        break;
      case "album":
        this.album.push({
          name: condition.name,
          artist: condition.artist,
        });
        break;
      case "track":
        this.track.push({
          name: condition.name,
          trackfilter: condition.trackfilter,
          filter: condition.filter,
        });
        break;
      case "playlist":
        this.playlist.push(condition.name);
        break;
      default:
        throw new Error("Invalid Keyword");
    }
  }
  // TODO: Implement to string function
  toString() {}

  getTracks() {}
}

export default PrimaryConditions;
