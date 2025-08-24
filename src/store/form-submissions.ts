import { create } from 'zustand';
import type { FormSubmission, Country } from '@/types';

interface FormStoreState {
  submissions: FormSubmission[];
  countries: Country[];
  addSubmission: (newSubmission: FormSubmission) => void;
  fetchCountries: () => Promise<void>;
}

export const useFormStore = create<FormStoreState>((set) => ({
  submissions: [],
  countries: [],

  addSubmission: (newSubmission) =>
    set((state) => ({
      submissions: [newSubmission, ...state.submissions],
    })),

  fetchCountries: async () => {
    try {
      const response = await fetch(
        'https://restcountries.com/v3.1/all?fields=name',
      );
      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }
      const data: Country[] = await response.json();

      const sortedCountries = data.sort((a, b) =>
        a.name.common.localeCompare(b.name.common),
      );

      set({ countries: sortedCountries });
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  },
}));
