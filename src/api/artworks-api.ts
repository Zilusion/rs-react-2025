import type {
  ArtworkDetailApiResponse,
  ArtworksApiParams,
  ArtworksApiResponse,
} from './artworks-api.types';

const BASE_URL = 'https://api.artic.edu/api/v1';
const IIIF_BASE_URL = 'https://www.artic.edu/iiif/2';
const DEFAULT_FIELDS =
  'id,title,image_id,date_display,artist_display,place_of_origin,short_description,description';
const IMAGE_URL_SUFFIX = '/full/843,/0/default.jpg';

export async function getArtworks(
  options: ArtworksApiParams = {},
): Promise<ArtworksApiResponse> {
  try {
    const parameters = new URLSearchParams();
    for (const [key, value] of Object.entries(options)) {
      if (value) {
        parameters.append(key, value.toString());
      }
    }
    if (!options.fields) {
      parameters.append('fields', DEFAULT_FIELDS);
    }

    const endpoint = parameters.has('q')
      ? `${BASE_URL}/artworks/search`
      : `${BASE_URL}/artworks`;
    const url = `${endpoint}?${parameters.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      const message = `An error has occurred: ${response.status} ${response.statusText}`;
      throw new Error(message);
    }
    return response.json();
  } catch (error) {
    throw new Error(`Failed to fetch artworks: ${(error as Error).message}`);
  }
}

export function getArtworkImageUrl(imageId: string | null): string | null {
  try {
    if (!imageId) {
      return null;
    }
    return `${IIIF_BASE_URL}/${imageId}${IMAGE_URL_SUFFIX}`;
  } catch (error) {
    throw new Error(`Failed to get artwork image URL: ${(error as Error).message}`);
  }
}

export async function getArtwork(
  id: number,
): Promise<ArtworkDetailApiResponse> {
  try {
    const url = `${BASE_URL}/artworks/${id}`;
    const response = await fetch(url);
    if (!response.ok) {
      const message = `An error has occurred: ${response.status} ${response.statusText}`;
      throw new Error(message);
    }
    return response.json();
  } catch (error) {
    throw new Error(`Failed to fetch artwork: ${(error as Error).message}`);
  }
}
