import React from "react";
import { TableVirtuoso } from "react-virtuoso";
import { TrackItem } from "./listitems/TrackItem";

import "./css/TrackTable.css";

const TrackTable = ({ items }) => {
  const width = window.innerWidth;
  return (
    // <table className="track-table">
    //   <thead>
    //     <tr>
    //       <th></th>
    //       <th>Track Name</th>
    //       <th>Album</th>
    //       <th>Artists</th>
    //     </tr>
    //   </thead>
    //   <tbody>
    //     {items.map((listItem, index) => (
    //       <TrackItem
    //         key={`${listItem.uri} - ${index}`}
    //         index={index + 1}
    //         track={listItem}
    //       />
    //     ))}
    //   </tbody>
    // </table>
    <TableVirtuoso
      className="track-table"
      data={items}
      fixedHeaderContent={() => {
        <tr>
          <th>Index</th>
          <th>Track Name</th>
          <th>Album</th>
          <th>Artists</th>
        </tr>;
      }}
      itemContent={(index, track) => (
        <TrackItem
          key={`${track.uri} - ${index}`}
          index={index + 1}
          track={track}
        />
      )}
    />
  );
};

export default TrackTable;
