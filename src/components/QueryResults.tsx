import React from "react";

import "./css/QueryResults.css";
import TrackTable from "./tables/TrackTable";
import { QueryResult } from "../parser/AST/QueryTypes/QueryType";

interface QueryResultsProps {
  type: string;
  results: QueryResult;
}

const QueryResults = (props: QueryResultsProps): JSX.Element => {
  const { type, results } = props;
  // Render the result of a get, add or deletetrack query
  const renderTracksQuery = (): JSX.Element => {
    if (results.items === undefined) {
      throw new Error("results.items is undefined");
    }
    return <TrackTable items={results.items}></TrackTable>;
  };
  // Render the result of a create playlist or delete playlist query
  const renderPlaylistQuery = (): JSX.Element => {
    return <div>{results.result}</div>;
  };
  // Render the result of a search query
  const renderSearchQuery = (): JSX.Element => {
    return (
      // <InfiniteScroll
      //   type="search"
      //   items={results.items}
      //   next={results.next}
      // ></InfiniteScroll>
      <div>WIP</div>
    );
  };

  switch (type) {
    case "Get":
    case "Add":
    case "DeleteTrack":
      return renderTracksQuery();
    case "Create":
    case "Drop":
      return renderPlaylistQuery();
    case "ArtistSearch":
    case "AlbumSearch":
    case "TrackSearch":
      return renderSearchQuery();
    default:
      return <div className="default">Waiting for a query</div>;
  }
};

export default QueryResults;
