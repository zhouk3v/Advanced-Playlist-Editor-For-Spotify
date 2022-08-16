const QueryResults = ({ type, results }) => {
  // Render the result of an add, get or deletetrack query
  const renderTracksQuery = () => {
    return results.map((result) => {
      return (
        <div>
          {result.name} -- {result.album.name} -- {result.artists[0].name}
        </div>
      );
    });
  };
  // Render the result of a create playlist or delete playlist query
  const renderPlaylistQuery = () => {
    return <div>{results}</div>;
  };
  // Render the result of a search query
  const renderSearchQuery = () => {
    return <div>Insert search results here</div>;
  };
  switch (type) {
    case 'Get':
    case 'Add':
    case 'DeleteTrack':
      return renderTracksQuery();
    case 'Create':
    case 'DeletePlaylist':
      return renderPlaylistQuery();
    case 'Search':
      return renderSearchQuery();
    default:
      return <div>Waiting for a query</div>;
  }
};

export default QueryResults;
