export const PATHS = {
  home: '/',
  collection: (page = 1) => `/collection/${page}`,
  details: (page: number, artworkId: number) =>
    `/collection/${page}/${artworkId}`,
  about: '/about',
};
