import {
  getTracksFromArtist,
  getTracksFromAlbums,
  getTracksFromPlaylist,
  getTrack,
} from "../../API/fetchTracks";

class PrimaryConditions {
  constructor() {
    this.artists = [];
    this.albums = [];
    this.tracks = [];
    this.playlists = [];
  }

  addConditions(conditions) {
    conditions.forEach((condition) => {
      this.addCondition(condition);
    });
  }

  addCondition(condition) {
    switch (condition.type) {
      case "artist":
        this.artists.push(condition.name);
        break;
      case "album":
        this.albums.push({
          name: condition.name,
          artist: condition.artist,
        });
        break;
      case "track":
        this.tracks.push({
          name: condition.name,
          filterType: condition.filterType,
          filter: condition.filter,
        });
        break;
      case "playlist":
        this.playlists.push(condition.name);
        break;
      default:
        throw new Error("Invalid Keyword");
    }
  }
  // TODO: Implement to string function
  toString() {}

  async getTracks() {
    const promises = [];
    this.artists.forEach((artist) => {
      promises.push(getTracksFromArtist(artist));
    });
    if (this.albums.length > 0) {
      promises.push(getTracksFromAlbums(this.albums));
    }
    this.tracks.forEach((track) => {
      promises.push(getTrack(track));
    });
  }
}

export default PrimaryConditions;
