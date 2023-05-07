import React, { useMemo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import "./css/TrackTable.css";

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

const TrackTable = ({ items }) => {
  const columns = useMemo(
    () => [
      {
        id: "index",
        accessorFn: (_, index) => {
          return index + 1;
        },
        header: "",
      },
      {
        id: "name",
        accessorFn: (track) => {
          return {
            name: track.name,
            url: track.external_urls.spotify,
          };
        },
        header: "Track Name",
        cell: (props) => (
          <a href={props.getValue().url} target="_blank" rel="noreferrer">
            {props.getValue().name}
          </a>
        ),
      },
      {
        id: "album",
        accessorFn: (track) => track.album,
        header: "Album",
        cell: (props) => (
          <a
            href={props.getValue().external_urls.spotify}
            target="_blank"
            rel="noreferrer"
          >
            {props.getValue().name}
          </a>
        ),
      },
      {
        accessorKey: "artists",
        header: "Artists",
        cell: (props) => <ArtistLinks artists={props.getValue()} />,
      },
    ],
    []
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="table">
      {table.getHeaderGroups().map((headerGroup) => {
        return headerGroup.headers.map((header, index) => {
          return (
            <div
              className="table-header"
              key={header.id}
              style={{
                gridColumn: index + 1,
              }}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </div>
          );
        });
      })}
      {table.getRowModel().rows.map((row) => {
        return row.getVisibleCells().map((cell, index) => {
          return (
            <div
              key={cell.id}
              style={{
                gridColumn: index + 1,
                padding: 5,
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          );
        });
      })}
    </div>
  );
};

export default TrackTable;
