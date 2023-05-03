import React, { useState, useRef, useEffect } from "react";
import { getJSON } from "../API/api";
import "./css/InfiniteScroll.css";
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

const InfiniteScroll = ({ type, items, next }) => {
  const [listItems, setListItems] = useState(items);
  const [nextUrl, setNextUrl] = useState(next);
  const [isFetching, setIsFetching] = useState(false);
  const listInnerRef = useRef();

  const handleScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight && nextUrl) {
        setIsFetching(true);
      }
    }
  };

  useEffect(() => {
    setListItems(items);
    setNextUrl(next);
  }, [items, next]);

  useEffect(() => {
    if (!isFetching) return;
    const fetchNextPage = async () => {
      const items = [...listItems];
      const nextPageJson = await getJSON(nextUrl);
      nextPageJson.items.forEach((trackObj) => items.push(trackObj.track));
      setListItems(items);
      setNextUrl(nextPageJson.next);
    };
    setIsFetching(false);
    fetchNextPage();
  }, [isFetching, listItems, nextUrl]);

  console.log(listItems);

  return (
    <div onScroll={handleScroll} className="query-results" ref={listInnerRef}>
      <AutoSizer>
        {({ width, height }) => (
          <Table
            height={height}
            width={width}
            rowCount={listItems.length}
            rowHeight={30}
            headerHeight={20}
            rowGetter={({ index }) => listItems[index]}
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
              width={300}
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
              width={100}
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

      {isFetching && "Fetching more list items..."}
    </div>
  );
};

export default InfiniteScroll;
