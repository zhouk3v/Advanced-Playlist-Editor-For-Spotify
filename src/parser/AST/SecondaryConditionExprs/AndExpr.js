class AndExpr {
  constructor(expr1, expr2) {
    this.expr1 = expr1;
    this.expr2 = expr2;
  }
  toString() {
    return `(${this.expr1.toString()} and ${this.expr2.toString()})`;
  }
  evaluate(track) {
    return this.expr1.evaluate(track) && this.expr2.evaluate(track);
  }
}

export default AndExpr;
