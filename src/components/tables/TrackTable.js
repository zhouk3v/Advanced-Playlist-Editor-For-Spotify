import React from "react";
import "./css/TrackTable.css";
import { TrackItem } from "./tableRows/TrackRow";

const TrackTable = ({ items }) => {
  return (
    <div className="query-results">
      <table className="query-results-table">
        <thead>
          <tr>
            <th></th>
            <th>Track Name</th>
            <th>Album</th>
            <th>Artists</th>
          </tr>
        </thead>
        <tbody>
          {items.map((listItem, index) => {
            return (
              <TrackItem
                key={`${listItem.uri} - ${index}`}
                index={index + 1}
                track={listItem}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TrackTable;
