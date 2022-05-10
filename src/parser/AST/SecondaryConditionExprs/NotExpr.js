class NotExpr {
  constructor(expr) {
    this.expr = expr;
  }
  toString() {
    return `(not ${this.expr.toString()})`;
  }
  evaluate(track) {
    return !this.expr.evaluate(track);
  }
}

export default NotExpr;
