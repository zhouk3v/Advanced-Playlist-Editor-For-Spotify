import { EQUALS_CONDITION, IN_CONDITION, REGEX_CONDITION } from "../config";

class BaseCondition {
  constructor(keyword, rhs) {
    this.keyword = keyword;
    this.type = rhs.type;
    this.term = rhs.term;
  }
  toString() {
    switch (this.type) {
      case EQUALS_CONDITION:
        return `${this.keyword} = ${this.term}`;
      case IN_CONDITION:
        const termsStr = this.term.join();
        return `${this.keyword} in (${termsStr})`;
      case REGEX_CONDITION:
        return `${this.keyword} LIKE ${this.term}`;
      default:
        return `THIS SHOULD NOT APPEAR`;
    }
  }
}

export default BaseCondition;
