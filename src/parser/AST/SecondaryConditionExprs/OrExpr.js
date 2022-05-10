class OrExpr {
  constructor(expr1, expr2) {
    this.expr1 = expr1;
    this.expr2 = expr2;
  }
  toString() {
    return `(${this.expr1.toString()} or ${this.expr2.toString()})`;
  }
  evaluate(track) {
    return this.expr1(track) || this.expr2(track);
  }
}

export default OrExpr;
