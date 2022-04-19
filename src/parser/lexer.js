class lexer {
  constructor(input) {
    this.input = [...input.trim()];
    this.index = 0;
    this.tokens = [];
    this.state = 0;
    this.tokenize();
  }

  tokenize() {
    const inputLength = this.input.length;
    let token = "";
    for (let i = 0; i < inputLength; i++) {
      if (this.input[i] === " ") {
        this.tokens.push(token);
        token = "";
      } else if (this.input[i] === `"`) {
        token = token + `"`;
        i++;
        while (i < inputLength && this.input[i] !== `"`) {
          token = token + this.input[i];
          i++;
        }
        token = token + '"';
        this.tokens.push(token);
        token = "";
      } else if (
        this.input[i] === "(" ||
        this.input[i] === ")" ||
        this.input[i] === ","
      ) {
        this.tokens.push(this.input[i]);
        token = "";
      } else {
        token = token + this.input[i];
      }
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
      return token.slice(1, token.size - 1);
    } else {
      throw new Error(`Unexpected token ${token}, are you missing a '"'?`);
    }
  }

  consumeEOF() {
    if (!this._inspectEOF()) {
      throw new Error(`Expected: EOF`);
    }
    return;
  }

  _inspectEOF() {
    return this.index === this.input.length;
  }

  _isTerm(input) {
    return input[0] === `"` && input[this.token.length - 1] === `"`;
  }
}

export default lexer;
