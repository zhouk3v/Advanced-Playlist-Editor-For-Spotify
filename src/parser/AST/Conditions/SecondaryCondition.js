class SecondaryConditions {
  constructor(expr) {
    this.expr = expr;
  }
  toString() {
    return `where ${this.expr.toString()}`;
  }
  evaluate(track) {
    return this.expr.evaluate(track);
  }
}

export default SecondaryConditions;
