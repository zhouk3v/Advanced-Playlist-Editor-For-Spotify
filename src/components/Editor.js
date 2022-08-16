import React, { useState } from "react";
import Parser from "../parser/parser";
import QueryResults from "./queryResults";

const Editor = ({ logout }) => {
  const [query, setQuery] = useState("");
  const [queryType, setQueryType] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState("");

  const parser = new Parser();

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading("Loading");
    const queryAST = parser.parseInput(query);
    const queryResult = await queryAST.execute();
    setLoading("");
    setQueryType(queryAST.type);
    setResult(queryResult);
  };

  return (
    <div>
      <div>{loading}</div>
      <button onClick={logout}>Logout</button>
      <form onSubmit={handleSubmit}>
        <textarea onChange={handleChange} />
        <div>
          <button>Submit Query</button>
        </div>
      </form>
      <QueryResults type={queryType} results={result}></QueryResults>
    </div>
  );
};

export default Editor;
