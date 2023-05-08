import { BaseConditionRHS } from "./BaseConditionsRHS/BaseConditionRHS";
import { Expr } from "./Expr";
// TODO: Determine if we should relax case-sensitivity for equals and in conditions
class BaseCondition implements Expr {
  keyword: string;
  rhs: BaseConditionRHS;
  constructor(keyword: string, rhs: BaseConditionRHS) {
    this.keyword = keyword;
    this.rhs = rhs;
  }
  evaluate(track: SpotifyApi.TrackObjectFull): boolean {
    return this.rhs.evaluate(this.keyword, track);
  }
}

export default BaseCondition;
