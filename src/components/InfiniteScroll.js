import React, { useState, useRef, useEffect } from "react";
import { getJSON } from "../API/api";
import "./css/InfiniteScroll.css";
import { TrackItem } from "./listitems/trackItem";

// TODO: fix last page duplication
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

  return (
    <div onScroll={handleScroll} className="query-results" ref={listInnerRef}>
      {listItems.map((listItem, index) => {
        if (type === "tracks") {
          return (
            // <div key={listItem.id} className="track">
            //   {index} -- {listItem.name} -- {listItem.album.name} --{" "}
            //   {listItem.artists[0].name}
            // </div>
            <TrackItem
              key={listItem.id}
              id={listItem.id}
              index={index}
              trackName={listItem.name}
              albumName={listItem.album.name}
              artistName={listItem.artists[0].name}
            />
          );
        } else {
          return <li key={listItem.id}>{listItem.name}</li>;
        }
      })}
      {isFetching && "Fetching more list items..."}
    </div>
  );
};

export default InfiniteScroll;
