export interface ArtworksApiParameters {
  page?: number;
  limit?: number;
  q?: string;
  fields?: string;
}

export interface Artwork {
  id: number;
  title: string;
  image_id: string | null;
  date_display: string;
  artist_display: string;
  place_of_origin: string;
  short_description: string;
  description: string;
}

export interface ArtworksApiResponse {
  data: Artwork[];
  info: {
    license_links: string[];
    license_text: string;
    version: string;
  };
  pagination: {
    current_page: number;
    limit: number;
    offset: number;
    total: number;
    total_pages: number;
  };
  config: {
    website_url: string;
    iiif_url: string;
  };
}
