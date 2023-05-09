import { Expr } from "../SecondaryConditionExprs/Expr";

class SecondaryConditions {
  expr: Expr;
  constructor(expr: Expr) {
    this.expr = expr;
  }

  evaluate(track: SpotifyApi.TrackObjectFull): boolean {
    return this.expr.evaluate(track);
  }
}

export default SecondaryConditions;
