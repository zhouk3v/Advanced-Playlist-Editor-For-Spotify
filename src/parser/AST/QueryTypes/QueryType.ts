import { TrackObject } from "../../../API/fetchTracks";

export interface QueryResult {
  result?: string;
  items?: Array<TrackObject>;
  artistSearchResults?: Array<SpotifyApi.ArtistObjectFull>;
  albumSearchResults?: Array<SpotifyApi.AlbumObjectSimplified>;
  trackSearchResults?: Array<SpotifyApi.TrackObjectFull>;
  next?: string | null;
}

export abstract class QueryType {
  type: string;
  constructor(type: string) {
    this.type = type;
  }
  abstract execute(): Promise<QueryResult>;
}
