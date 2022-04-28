class NotExpr {
  constructor(expr) {
    this.expr = expr;
  }
  toString() {
    return `(not ${this.expr.toString()})`;
  }
}

export default NotExpr;
