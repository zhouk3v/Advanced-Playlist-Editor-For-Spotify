import { TrackObject } from "../../../../API/fetchTracks";
import { Expr } from "./Exprs/Expr";

class SecondaryConditions {
  expr: Expr;

  constructor(expr: Expr) {
    this.expr = expr;
  }

  evaluate(track: TrackObject): boolean {
    return this.expr.evaluate(track);
  }
}

export default SecondaryConditions;
