import React, { useMemo } from "react";
import { TableVirtuoso } from "react-virtuoso";
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
        id: "img",
        accessorFn: (track) => {
          return track.album.images.at(-1).url;
        },
        cell: (props) => {
          return <img src={props.getValue()} alt="" width={40} height={40} />;
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

  const rows = table.getRowModel().rows;

  const getHeaderWidth = (header) => {
    switch (header) {
      case "index":
        return "1vw";
      case "img":
        return "40px";
      case "name":
        return "50vw";
      default:
        return "25vw";
    }
  };

  return (
    <TableVirtuoso
      data={rows}
      fixedHeaderContent={() => {
        return table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                style={{
                  width: getHeaderWidth(header.id),
                }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ));
      }}
      itemContent={(index, row) => (
        <>
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              style={{ background: index % 2 === 1 ? "rgb(7,7,7)" : "black" }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </>
      )}
    />
  );
};

export default TrackTable;
