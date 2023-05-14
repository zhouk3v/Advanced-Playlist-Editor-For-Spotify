import { Expr } from "./Expr";
import { TrackObject } from "../../../API/fetchTracks";

class NotExpr extends Expr {
  expr: Expr;
  constructor(expr: Expr) {
    super();
    this.expr = expr;
  }
  evaluate(track: TrackObject): boolean {
    return !this.expr.evaluate(track);
  }
}

export default NotExpr;
