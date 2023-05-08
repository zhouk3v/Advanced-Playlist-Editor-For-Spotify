import { Expr } from "./Expr";

class NotExpr implements Expr {
  expr: Expr;
  constructor(expr: Expr) {
    this.expr = expr;
  }
  evaluate(track: SpotifyApi.TrackObjectFull): boolean {
    return !this.expr.evaluate(track);
  }
}

export default NotExpr;
