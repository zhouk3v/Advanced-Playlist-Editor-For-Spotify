import PrimaryConditions from "../Conditions/PrimaryConditions";
import SecondaryConditions from "../Conditions/SecondaryCondition";
import { QueryType, TrackQueryResult } from "./QueryType";

class Get extends QueryType<TrackQueryResult> {
  primary: PrimaryConditions;
  secondary: SecondaryConditions;
  constructor(primary: PrimaryConditions, secondary: SecondaryConditions) {
    super("Get");
    this.primary = primary;
    this.secondary = secondary;
  }
  async execute(): Promise<TrackQueryResult> {
    const unfilteredTracks = await this.primary.getTracks();
    if (!this.secondary) {
      return {
        items: unfilteredTracks,
      };
    }
    const filteredTracks = unfilteredTracks.filter((track) =>
      this.secondary.evaluate(track)
    );
    return {
      items: filteredTracks,
    };
  }
}

export default Get;
