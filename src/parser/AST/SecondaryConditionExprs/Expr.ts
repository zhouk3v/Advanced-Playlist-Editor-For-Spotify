import { TrackObject } from "../../../API/fetchTracks";

export abstract class Expr {
  abstract evaluate(track: TrackObject): boolean;
}
