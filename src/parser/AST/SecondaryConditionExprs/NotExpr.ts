import { Expr } from "./Expr";

class NotExpr extends Expr {
  expr: Expr;
  constructor(expr: Expr) {
    super();
    this.expr = expr;
  }
  evaluate(track: SpotifyApi.TrackObjectFull): boolean {
    return !this.expr.evaluate(track);
  }
}

export default NotExpr;
