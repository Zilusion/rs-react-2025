export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  total_pages: number;
  current_page: number;
}

export interface ApiInfo {
  license_text: string;
  license_links: string[];
  version: string;
}

export interface ApiConfig {
  iiif_url: string;
  website_url: string;
}

export interface Artwork {
  dimensions: string;
  medium_display: string;
  id: number;
  title: string;
  image_id: string | null;
  date_display: string;
  artist_display: string;
  place_of_origin: string;
  short_description: string;
  description: string;
}

export interface ArtworksApiParams {
  page?: number;
  limit?: number;
  q?: string;
  fields?: string;
}

export interface ArtworksApiResponse {
  pagination: Pagination;
  data: Artwork[];
  info: ApiInfo;
  config: ApiConfig;
}

export interface ArtworkDetailApiResponse {
  data: Artwork;
  info: ApiInfo;
  config: ApiConfig;
}
