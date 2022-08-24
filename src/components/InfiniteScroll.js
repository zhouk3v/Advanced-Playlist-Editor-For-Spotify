import React, { useState, useRef, useEffect } from "react";
import { getJSON } from "../API/api";
import "./css/InfiniteScroll.css";

// TODO: fix last page duplication
const InfiniteScroll = ({ items, next }) => {
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
      const tracks = [...listItems];
      const nextPageJson = await getJSON(nextUrl);
      nextPageJson.items.forEach((trackObj) => tracks.push(trackObj.track));
      setListItems(tracks);
      setNextUrl(nextPageJson.next);
    };
    setIsFetching(false);
    fetchNextPage();
  }, [isFetching, listItems, nextUrl]);

  return (
    <div onScroll={handleScroll} className="query-results" ref={listInnerRef}>
      <ol>
        {listItems.map((listItem) => (
          <li key={listItem.id}>
            {listItem.name} -- {listItem.album.name} --{" "}
            {listItem.artists[0].name} -- {listItem.id}
          </li>
        ))}
      </ol>
      {isFetching && "Fetching more list items..."}
    </div>
  );
};

export default InfiniteScroll;
