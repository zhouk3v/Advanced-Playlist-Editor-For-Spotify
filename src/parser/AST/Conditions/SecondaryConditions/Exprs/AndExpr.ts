import { Expr } from "./Expr";
import { TrackObject } from "../../../../../API/fetchTracks";

class AndExpr extends Expr {
  expr1: Expr;
  expr2: Expr;

  constructor(expr1: Expr, expr2: Expr) {
    super();
    this.expr1 = expr1;
    this.expr2 = expr2;
  }
  
  evaluate(track: TrackObject) {
    return this.expr1.evaluate(track) && this.expr2.evaluate(track);
  }
}

export default AndExpr;
