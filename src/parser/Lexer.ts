// TODO: overhaul error throwing
class lexer {
  setChars: Set<string>;
  assignChars: Set<string>;
  tokens: Array<string>;
  index: number;

  constructor() {
    this.setChars = new Set(["(", ")", ",", "[", "]"]);
    this.assignChars = new Set([":", "=", "-"]);
    this.tokens = [];
    this.index = 0;
  }

  tokenize(input: string): void {
    // TODO: refactor this
    const inputLength = input.length;
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
      } else if (this.setChars.has(input[i])) {
        this.tokens.push(input[i]);
        token = "";
      } else if (this.assignChars.has(input[i])) {
        if (token !== "") {
          this.tokens.push(token);
        }
        this.tokens.push(input[i]);
        token = "";
      } else {
        token = token + input[i];
      }
      i++;
    }
  }

  inspect(toInspect: string): boolean {
    const token = this.tokens[this.index];
    return token === toInspect;
  }

  consume(toConsume: string): string {
    const token = this.tokens[this.index];
    if (token === toConsume) {
      this.index++;
      return token;
    } else {
      throw new Error(`Unexpected token ${token}, expecting ${toConsume}`);
    }
  }

  inspectTerm(): boolean {
    const token = this.tokens[this.index];
    return this._isTerm(token);
  }

  consumeTerm(): string {
    const token = this.tokens[this.index];
    if (this._isTerm(token)) {
      this.index++;
      return token.slice(1, -1);
    } else {
      throw new Error(
        `Unexpected token ${token}, expecting a term here, did you forget a "?`
      );
    }
  }

  consumeEOF(): void {
    if (!this._inspectEOF()) {
      throw new Error(`Expected EOL, found ${this.tokens[this.index]} instead`);
    }
    return;
  }

  _inspectEOF(): boolean {
    return this.index === this.tokens.length;
  }

  _isTerm(input: string): boolean {
    return input[0] === `"` && input[input.length - 1] === `"`;
  }
}

export default lexer;
