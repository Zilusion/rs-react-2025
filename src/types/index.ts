export interface YearData {
  year: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
  [key: string]: number | undefined;
}

export type Region = 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Oceania';

export interface Country {
  name: string;
  iso_code?: string;
  data: YearData[];
  region?: Region;
}
