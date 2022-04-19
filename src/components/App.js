import React, { Component } from "react";
import Recognizer from "../parser/recognizer";

class App extends Component {
  state = {
    query: "",
    result: "",
  };

  handleChange = (event) => {
    this.setState({ query: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    this.setState({ result: this.state.query });

    const recognizer = new Recognizer(this.state.query);
    recognizer.query();
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <textarea onChange={this.handleChange} value={this.state.comment} />
          <div>
            <button>Submit Comment</button>
          </div>
        </form>
        <div>{this.state.result}</div>
      </div>
    );
  }
}

export default App;
