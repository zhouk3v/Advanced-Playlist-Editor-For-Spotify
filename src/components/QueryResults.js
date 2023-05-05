import React from "react";

import "./css/QueryResults.css";
import InfiniteScroll from "./tables/InfiniteScroll";
import TrackTable from "./tables/TrackTable";

const QueryResults = ({ type, results }) => {
  // Render the result of a get, add or deletetrack query
  const renderTracksQuery = () => {
    return <TrackTable items={results.items} />;
  };
  // Render the result of a create playlist or delete playlist query
  const renderPlaylistQuery = () => {
    return <div>{results}</div>;
  };
  // Render the result of a search query
  const renderSearchQuery = () => {
    return (
      <InfiniteScroll
        type="search"
        items={results.items}
        next={results.url}
      ></InfiniteScroll>
    );
  };

  switch (type) {
    case "Get":
    case "Add":
    case "DeleteTrack":
      return renderTracksQuery();
    case "Create":
    case "DeletePlaylist":
      return renderPlaylistQuery();
    case "Search":
      return renderSearchQuery();
    default:
      return <div className="default">Waiting for a query</div>;
  }
};

export default QueryResults;
