import type { BaseFormOut } from '@/validation/form-schema';

export type FormSubmission = Omit<BaseFormOut, 'picture'> & {
  id: string;
  picture: string;
};

export interface Country {
  name: {
    common: string;
    official: string;
  };
}
