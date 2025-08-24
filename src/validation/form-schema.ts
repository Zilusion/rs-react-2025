import { z } from 'zod';

const MAX_FILE_SIZE_MB = 1;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

export const formSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required.')
      .refine(
        (value) => /^[A-Z]/.test(value),
        'Name must start with a capital letter.',
      ),
    age: z.coerce
      .number<string>('Age must be a number.')
      .positive('Age should be a positive number.'),
    email: z
      .string()
      .min(1, 'Email is required.')
      .email('Invalid email address.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    gender: z.enum(['male', 'female'], 'Gender is required.'),
    acceptTerms: z.literal(true, 'You must accept the Terms and Conditions.'),
    picture: z
      .instanceof(FileList)
      .refine((files) => files?.length === 1, 'Image is required.')
      .refine(
        (files) => files?.[0]?.size <= MAX_FILE_SIZE_BYTES,
        `Max file size is ${MAX_FILE_SIZE_MB}MB.`,
      )
      .refine(
        (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
        `Only ${ACCEPTED_IMAGE_TYPES.map((type) => type.split('/')[1]).join(', ')} formats are supported.`,
      ),
    country: z.string().min(1, 'Please select a country.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    error: "Passwords don't match",
    when(payload) {
      const onlyPw = formSchema.pick({
        password: true,
        confirmPassword: true,
      });
      return onlyPw.safeParse(payload.value).success;
    },
  });
