import { ISO_TO_REGION } from '@/constants/regions';
import type { Country, YearData } from '@/types';

export async function fetchAndProcessData(): Promise<Country[]> {
  const DATA_URL =
    'https://nyc3.digitaloceanspaces.com/owid-public/data/co2/owid-co2-data.json';

  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  interface OwidCountryJson {
    iso_code?: string;
    data: YearData[];
  }

  const json: Record<string, OwidCountryJson> = await response.json();

  const countries: Country[] = [];
  for (const countryName in json) {
    const entry = json[countryName];
    if (entry.iso_code) {
      const iso = entry.iso_code;
      countries.push({
        name: countryName,
        iso_code: iso,
        region: ISO_TO_REGION[iso],
        data: entry.data.map((d) => ({
          ...d,
          population: d.population === 0 ? undefined : d.population,
          co2: d.co2 === 0 ? undefined : d.co2,
          co2_per_capita: d.co2_per_capita === 0 ? undefined : d.co2_per_capita,
        })),
      });
    }
  }
  return countries;
}

function wrapPromise<T>(promise: Promise<T>): { read: () => T } {
  let status = 'pending';
  let result: T;
  const suspender = promise.then(
    (r) => {
      status = 'success';
      result = r;
    },
    (e) => {
      status = 'error';
      result = e;
    },
  );
  return {
    read() {
      if (status === 'pending') throw suspender;
      if (status === 'error') throw result;
      if (status === 'success') return result;
      return result;
    },
  };
}

const resource = wrapPromise(fetchAndProcessData());

export function useDataResource() {
  return resource.read();
}
