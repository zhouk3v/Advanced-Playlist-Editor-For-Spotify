export interface TrackSearchObject extends TrackSearchRHS {
  name: string;
}

export interface TrackSearchRHS {
  filterType: string;
  filter: string;
}
