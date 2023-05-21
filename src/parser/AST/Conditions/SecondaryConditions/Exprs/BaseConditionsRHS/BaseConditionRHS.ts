import { TrackObject } from "../../../../../../API/fetchTracks";

export abstract class BaseConditionRHS {
  type: Number;
  constructor(type: Number) {
    this.type = type;
  }

  abstract evaluate(keyword: string, track: TrackObject): boolean;
}
