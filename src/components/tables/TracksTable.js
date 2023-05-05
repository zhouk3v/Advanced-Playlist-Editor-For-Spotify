import React from "react";
import "./css/TracksTable.css";
import { Table, AutoSizer, Column } from "react-virtualized";
import "react-virtualized/styles.css";

const ArtistLinks = ({ artists }) => {
  return (
    <>
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
    </>
  );
};

const TracksTable = ({ items }) => {
  console.log(items);
  return (
    <div className="query-results">
      <AutoSizer>
        {({ width, height }) => (
          <Table
            height={height}
            width={width}
            rowCount={items.length}
            rowHeight={30}
            headerHeight={20}
            rowGetter={({ index }) => items[index]}
          >
            <Column
              label=""
              cellRenderer={({ rowIndex }) => rowIndex + 1}
              dataKey="index"
              width={100}
            />
            <Column
              label="Track"
              dataKey="name"
              width={250}
              flexGrow={3}
              cellRenderer={({ rowData }) => (
                <a
                  href={rowData.external_urls.spotify}
                  target="_blank"
                  rel="noreferrer"
                >
                  {rowData.name}
                </a>
              )}
            />
            <Column
              label="Album"
              dataKey="album"
              width={150}
              flexGrow={1}
              cellRenderer={({ rowData }) => (
                <a
                  href={rowData.album.external_urls.spotify}
                  target="_blank"
                  rel="noreferrer"
                >
                  {rowData.album.name}
                </a>
              )}
            />
            <Column
              label="Artists"
              dataKey="album"
              width={200}
              flexGrow={2}
              cellRenderer={({ rowData }) => (
                <ArtistLinks artists={rowData.artists} />
              )}
            />
          </Table>
        )}
      </AutoSizer>
    </div>
  );
};

export default TracksTable;
