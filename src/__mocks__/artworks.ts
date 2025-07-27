import type { Artwork, ArtworksApiResponse } from '@/api/artworks-api.types';

export const MOCK_ARTWORK_WITH_IMAGE: Artwork = {
  id: 123,
  title: 'Starry Night',
  artist_display: 'Vincent van Gogh',
  image_id: 'a-real-image-id',
  date_display: '1889',
  place_of_origin: 'Saint-Rémy-de-Provence, France',
  short_description: 'A painting by Vincent van Gogh',
  description: 'A beautiful painting.',
  dimensions: '73.7 cm × 92.1 cm',
  medium_display: 'Oil on canvas',
};

export const MOCK_ARTWORK_WITHOUT_IMAGE: Artwork = {
  ...MOCK_ARTWORK_WITH_IMAGE,
  id: 456,
  image_id: null,
};

export const MOCK_ARTWORK_ANOTHER: Artwork = {
  id: 789,
  title: 'The Persistence of Memory',
  artist_display: 'Salvador Dalí',
  image_id: 'another-real-id',
  date_display: '1931',
  place_of_origin: 'Spain',
  short_description: 'A surrealist painting.',
  description: 'A famous surrealist painting.',
  dimensions: '24 cm × 33 cm',
  medium_display: 'Oil on canvas',
};

const BASE_API_RESPONSE = {
  info: { license_links: [], license_text: '', version: '' },
  pagination: {
    current_page: 1,
    limit: 1,
    offset: 0,
    total: 1,
    total_pages: 1,
  },
  config: { website_url: '', iiif_url: '' },
};

export const MOCK_API_RESPONSE_LIST: ArtworksApiResponse = {
  ...BASE_API_RESPONSE,
  data: [MOCK_ARTWORK_WITH_IMAGE, MOCK_ARTWORK_ANOTHER],
};

export const MOCK_API_RESPONSE_LIST_ANOTHER = {
  ...BASE_API_RESPONSE,
  data: [MOCK_ARTWORK_ANOTHER, MOCK_ARTWORK_WITHOUT_IMAGE],
};

export const MOCK_API_RESPONSE_EMPTY: ArtworksApiResponse = {
  ...BASE_API_RESPONSE,
  data: [],
};

export const MOCK_API_RESPONSE_DETAILS = {
  ...BASE_API_RESPONSE,
  data: MOCK_ARTWORK_WITH_IMAGE,
};

export const MOCK_API_RESPONSE_DETAILS_ANOTHER = {
  ...BASE_API_RESPONSE,
  data: MOCK_ARTWORK_ANOTHER,
};
