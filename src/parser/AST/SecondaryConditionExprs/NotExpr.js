class NotExpr {
  constructor(expr) {
    this.expr = expr;
  }
  evaluate(track) {
    return !this.expr.evaluate(track);
  }
}

export default NotExpr;
