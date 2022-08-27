class OrExpr {
  constructor(expr1, expr2) {
    this.expr1 = expr1;
    this.expr2 = expr2;
  }
  evaluate(track) {
    return this.expr1.evaluate(track) || this.expr2.evaluate(track);
  }
}

export default OrExpr;
