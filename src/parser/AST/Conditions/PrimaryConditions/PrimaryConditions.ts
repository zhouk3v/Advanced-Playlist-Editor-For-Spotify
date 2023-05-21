import {
  getTracksFromArtist,
  getTracksFromAlbums,
  getAllTracksFromPlaylist,
  getTrack,
  TrackObject,
} from "../../../../API/fetchTracks";
import { AlbumSearchObject } from "../SearchObjects/AlbumSearchObject";
import { TrackSearchObject } from "../SearchObjects/TrackSearchObject";

export interface PrimaryCondition {
  type: string;
  name: string;
  filter?: string;
  filterType?: string;
}

class PrimaryConditions {
  artists: Array<string>;
  albums: Array<AlbumSearchObject>;
  tracks: Array<TrackSearchObject>;
  playlists: Array<string>;
  constructor() {
    this.artists = [];
    this.albums = [];
    this.tracks = [];
    this.playlists = [];
  }

  addConditions(conditions: Array<PrimaryCondition>) {
    conditions.forEach((condition) => {
      this.addCondition(condition);
    });
  }

  addCondition(condition: PrimaryCondition) {
    switch (condition.type) {
      case "artist":
        this.artists.push(condition.name);
        break;
      case "album":
        if (condition.filter === undefined) {
          // We shouldn't throw this error, as the parser should throw it instead
          throw new Error("Missing artist for album");
        }
        this.albums.push({
          name: condition.name,
          artist: condition.filter,
        });
        break;
      case "track":
        if (
          condition.filter === undefined ||
          condition.filterType === undefined
        ) {
          // We shouldn't throw this error, as the parser should throw it instead
          throw new Error("Missing artist or album for track");
        }
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

  async getTracks(): Promise<Array<TrackObject>> {
    const promises = [];
    this.artists.forEach((artist: string) => {
      promises.push(getTracksFromArtist(artist));
    });
    if (this.albums.length > 0) {
      promises.push(getTracksFromAlbums(this.albums));
    }
    this.tracks.forEach((track: TrackSearchObject) => {
      promises.push(getTrack(track));
    });
    this.playlists.forEach((playlist: string) => {
      promises.push(getAllTracksFromPlaylist(playlist));
    });
    const tracks = await Promise.all(promises);
    // We need to filter for undefined as getTrack can resolve to undefined
    return tracks.flat().filter((track) => track !== undefined);
  }
}

export default PrimaryConditions;
