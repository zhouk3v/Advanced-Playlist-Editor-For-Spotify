import React, { useState, useRef, useEffect } from "react";
import { getJSON } from "../API/api";
import "./css/InfiniteScroll.css";
import { TrackItem } from "./listitems/trackItem";

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
          {listItems.map((listItem, index) => {
            if (type === "tracks") {
              return (
                <TrackItem
                  key={`${listItem.uri} - ${index}`}
                  index={index + 1}
                  track={listItem}
                />
              );
            } else {
              return (
                <tr key={listItem.id}>
                  <td>{listItem.name}</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
      {isFetching && "Fetching more list items..."}
    </div>
  );
};

export default InfiniteScroll;
