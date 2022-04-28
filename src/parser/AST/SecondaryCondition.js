class SecondaryConditions {
  constructor(expr) {
    this.expr = expr;
  }
  toString() {
    return `where ${this.expr.toString()}`;
  }
}

export default SecondaryConditions;
