import React from "react";
import {
  Table,
  AutoSizer,
  Column,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";
import "./css/TracksTable.css";
import "react-virtualized/styles.css";

const ArtistLinks = ({ artists, onResize }) => {
  return (
    <div onResize={onResize}>
      <a
        key={`${artists[0].name} 0`}
        href={artists[0].external_urls.spotify}
        target="_blank"
        rel="noreferrer"
      >
        {artists[0].name}
      </a>
      {artists.map((artist, index) => {
        return index > 0 ? (
          <span key={`${artist.name} ${index}`}>
            ,{" "}
            <a
              href={artist.external_urls.spotify}
              target="_blank"
              rel="noreferrer"
            >
              {artist.name}
            </a>
          </span>
        ) : null;
      })}
    </div>
  );
};

// const CellRenderer = (cache, parent, dataKey, rowIndex, children) => (
//   <CellMeasurer
//     cache={cache}
//     columnIndex={0}
//     parent={parent}
//     key={dataKey}
//     rowIndex={rowIndex}
//   >
//     <div
//       style={{
//         whiteSpace: "normal",
//       }}
//     >
//       {children}
//     </div>
//   </CellMeasurer>
// );

const TracksTable = ({ items }) => {
  const cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 30,
  });

  return (
    <div className="query-results">
      <AutoSizer>
        {({ width, height }) => (
          <Table
            deferredMeasurementCache={cache}
            height={height}
            width={width}
            rowCount={items.length}
            rowHeight={cache.rowHeight}
            headerHeight={20}
            rowGetter={({ index }) => items[index]}
          >
            <Column
              label=""
              dataKey="index"
              cellRenderer={({ parent, rowIndex, dataKey }) => (
                <CellMeasurer
                  cache={cache}
                  columnIndex={0}
                  parent={parent}
                  key={dataKey}
                  rowIndex={rowIndex}
                >
                  {({ measure, registerChild }) => (
                    <div
                      ref={registerChild}
                      onResize={measure}
                      style={{
                        whiteSpace: "normal",
                      }}
                    >
                      {rowIndex + 1}
                    </div>
                  )}
                </CellMeasurer>
              )}
              width={100}
            />
            <Column
              label="Track"
              dataKey="name"
              width={200}
              flexGrow={2}
              cellRenderer={({ rowData, parent, rowIndex, dataKey }) => (
                <CellMeasurer
                  cache={cache}
                  columnIndex={0}
                  parent={parent}
                  key={dataKey}
                  rowIndex={rowIndex}
                >
                  {({ measure, registerChild }) => (
                    <div
                      ref={registerChild}
                      style={{
                        whiteSpace: "normal",
                      }}
                    >
                      <a
                        onResize={measure}
                        href={rowData.external_urls.spotify}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {rowData.name}
                      </a>
                    </div>
                  )}
                </CellMeasurer>
              )}
            />
            <Column
              label="Album"
              dataKey="album"
              width={200}
              flexGrow={1}
              cellRenderer={({ rowData, parent, rowIndex, dataKey }) => (
                <CellMeasurer
                  cache={cache}
                  columnIndex={0}
                  parent={parent}
                  key={dataKey}
                  rowIndex={rowIndex}
                >
                  {({ measure, registerChild }) => (
                    <div
                      ref={registerChild}
                      style={{
                        whiteSpace: "normal",
                      }}
                    >
                      <a
                        href={rowData.album.external_urls.spotify}
                        target="_blank"
                        rel="noreferrer"
                        onResize={measure}
                      >
                        {rowData.album.name}
                      </a>
                    </div>
                  )}
                </CellMeasurer>
              )}
            />
            <Column
              label="Artists"
              dataKey="artists"
              width={200}
              flexGrow={1}
              cellRenderer={({ rowData, parent, rowIndex, dataKey }) => (
                <CellMeasurer
                  cache={cache}
                  columnIndex={0}
                  parent={parent}
                  key={dataKey}
                  rowIndex={rowIndex}
                >
                  {({ measure, registerChild }) => (
                    <div
                      ref={registerChild}
                      style={{
                        whiteSpace: "normal",
                      }}
                    >
                      <ArtistLinks
                        onResize={measure}
                        artists={rowData.artists}
                      />
                    </div>
                  )}
                </CellMeasurer>
              )}
            />
          </Table>
        )}
      </AutoSizer>
    </div>
  );
};

export default TracksTable;
