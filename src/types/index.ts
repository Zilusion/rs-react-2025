import { z } from 'zod';
import { formSchema } from '@/validation/form-schema';

export type FormValuesIn = z.input<typeof formSchema>;
export type FormValuesOut = z.output<typeof formSchema>;

export type FormSubmission = Omit<FormValuesOut, 'picture'> & {
  id: string;
  picture: string;
};

export interface Country {
  name: {
    common: string;
    official: string;
  };
}
