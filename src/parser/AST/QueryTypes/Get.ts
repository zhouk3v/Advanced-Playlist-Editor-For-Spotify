import PrimaryConditions from "../Conditions/PrimaryConditions/PrimaryConditions";
import SecondaryConditions from "../Conditions/SecondaryConditions/SecondaryCondition";
import { QueryType, QueryResult } from "./QueryType";

class Get extends QueryType {
  primary: PrimaryConditions;
  secondary: SecondaryConditions | null;

  constructor(
    primary: PrimaryConditions,
    secondary: SecondaryConditions | null
  ) {
    super("Get");
    this.primary = primary;
    this.secondary = secondary;
  }
  
  async execute(): Promise<QueryResult> {
    const unfilteredTracks = await this.primary.getTracks();
    if (this.secondary === null) {
      return {
        items: unfilteredTracks,
      };
    }
    const filteredTracks = unfilteredTracks.filter((track) =>
      this.secondary?.evaluate(track)
    );
    return {
      items: filteredTracks,
    };
  }
}

export default Get;
