import { TrackObject } from "../../../API/fetchTracks";

export interface PlaylistQueryResult {
  result: string;
}

export interface TrackQueryResult {
  items: Array<TrackObject>;
}

export interface SearchResult<T> {
  items: Array<T>;
  next: string | null;
}

export abstract class QueryType<T> {
  type: string;
  constructor(type: string) {
    this.type = type;
  }
  abstract execute(): Promise<T>;
}
