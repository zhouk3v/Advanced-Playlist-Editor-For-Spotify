import React from "react";
import "./css/TrackTable.css";
import { TrackItem } from "./tableRows/TrackRow";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";


const Row = ({ index, style }) => (

);

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
          <AutoSizer>{(height, width) => (
            <FixedSizeList>

            </FixedSizeList>
          )}</AutoSizer>
        </tbody>
      </table>
    </div>
  );
};

export default TrackTable;
