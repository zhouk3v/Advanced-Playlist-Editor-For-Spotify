// TODO: Implement infinite scroll with results
import React from "react";

import "./css/QueryResults.css";
import InfiniteScroll from "./InfiniteScroll";

const QueryResults = ({ type, results }) => {
  // Render the result of a get query
  const renderGetQuery = () => {
    // return results.tracks.map((result) => {
    //   return (
    //     <div key={result.id}>
    //       {result.name} -- {result.album.name} -- {result.artists[0].name}
    //     </div>
    //   );
    // });
    return (
      <InfiniteScroll
        items={results.tracks}
        next={results.url}
      ></InfiniteScroll>
    );
  };
  // Render the result of an add or deletetrack query
  const renderTracksQuery = () => {
    return (
      <InfiniteScroll
        items={results.tracks}
        next={results.url}
      ></InfiniteScroll>
    );
  };
  // Render the result of a create playlist or delete playlist query
  const renderPlaylistQuery = () => {
    return <div>{results}</div>;
  };
  // Render the result of a search query
  const renderSearchQuery = () => {
    return <div>Insert search results here</div>;
  };

  switch (type) {
    case "Get":
      return renderGetQuery();
    case "Add":
    case "DeleteTrack":
      return renderTracksQuery();
    case "Create":
    case "DeletePlaylist":
      return renderPlaylistQuery();
    case "Search":
      return renderSearchQuery();
    default:
      return <div>Waiting for a query</div>;
  }
};

export default QueryResults;
