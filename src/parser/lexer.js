// TODO: overhaul error throwing
class lexer {
  constructor() {
    this.bracketChars = new Set(["(", ")", ",", "[", "]"]);
    this.assignChars = new Set([":", "="]);
  }

  tokenize(input) {
    const inputLength = input.length;
    this.tokens = [];
    this.index = 0;
    let token = "";
    let i = 0;
    while (i < inputLength) {
      if (input[i] === " ") {
        if (token !== "") {
          this.tokens.push(token);
        }
        token = "";
      } else if (input[i] === `"`) {
        token = token + `"`;
        i++;
        while (i < inputLength && input[i] !== `"`) {
          token = token + input[i];
          i++;
        }
        if (input[i] === `"`) {
          token = token + '"';
        }
        this.tokens.push(token);
        token = "";
      } else if (this.bracketChars.has(input[i]) || input[i] === ",") {
        this.tokens.push(input[i]);
        token = "";
      } else if (this.assignChars.has(input[i])) {
        this.tokens.push(token);
        this.tokens.push(input[i]);
        token = "";
      } else {
        token = token + input[i];
      }
      i++;
    }
  }

  inspect(toInspect) {
    const token = this.tokens[this.index];
    return token === toInspect;
  }
  consume(toConsume) {
    const token = this.tokens[this.index];
    if (token === toConsume) {
      this.index++;
      return token;
    } else {
      throw new Error(`Unexpected token ${token}, expecting ${toConsume}`);
    }
  }

  inspectTerm() {
    const token = this.tokens[this.index];
    return this._isTerm(token);
  }
  consumeTerm() {
    const token = this.tokens[this.index];
    if (this._isTerm(token)) {
      this.index++;
      return token.slice(1, -1);
    } else {
      throw new Error(`Unexpected token ${token}, expecting a term here`);
    }
  }

  consumeEOF() {
    if (!this._inspectEOF()) {
      throw new Error(`Expected: EOF`);
    }
    return;
  }

  _inspectEOF() {
    return this.index === this.tokens.length;
  }

  _isTerm(input) {
    return input[0] === `"` && input[input.length - 1] === `"`;
  }
}

export default lexer;
