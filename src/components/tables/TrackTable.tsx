import { TableVirtuoso } from "react-virtuoso";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import "./css/TrackTable.css";
import { TrackObject } from "../../API/fetchTracks";

interface ArtistLinksProps {
  artists: Array<SpotifyApi.ArtistObjectSimplified>;
}

const ArtistLinks = (props: ArtistLinksProps) => {
  const { artists } = props;
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

interface TrackTableProps {
  items: Array<TrackObject>;
}

const TrackTable = (props: TrackTableProps) => {
  const { items } = props;

  const columnHelper = createColumnHelper<TrackObject>();

  const columns = [
    columnHelper.display({ id: "index", cell: (props) => props.row.index + 1 }),
    columnHelper.display({
      id: "img",
      cell: (props) => (
        <img
          src={props.row.original.album.images.at(-1)?.url}
          alt="album cover art"
          width={40}
          height={40}
        />
      ),
    }),
    columnHelper.accessor("name", {
      header: "Track Name",
      cell: (props) => (
        <a
          href={props.row.original.external_urls.spotify}
          target="_blank"
          rel="noreferrer"
        >
          {props.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor("album", {
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
    }),
    columnHelper.accessor("artists", {
      header: "Artists",
      cell: (props) => <ArtistLinks artists={props.getValue()} />,
    }),
  ];

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  const getHeaderWidth = (header: string) => {
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
