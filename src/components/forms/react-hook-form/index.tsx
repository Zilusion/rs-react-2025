import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  makeFormSchema,
  type BaseFormIn,
  type BaseFormOut,
} from '@/validation/form-schema';
import { InputField } from '@/components/ui/fields/input-field';
import { SelectField } from '@/components/ui/fields/select-field';
import { FileField } from '@/components/ui/fields/file-field';
import { CheckboxField } from '@/components/ui/fields/checkbox-field';
import { SubmitButton } from '@/components/ui/submit-button';
import { PasswordStrength } from '@/components/ui/password-strength';
import type { FormSubmission } from '@/types';
import { fileToBase64 } from '@/lib/file-utils';
import { useFormStore } from '@/store/form-submissions';
import { useEffect, useMemo } from 'react';

function genId(): string {
  return `id_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

export function RHFForm({
  onSuccess,
}: {
  onSuccess: (d: FormSubmission) => void;
}) {
  const countries = useFormStore((s) => s.countries);
  const schema = useMemo(
    () => makeFormSchema(countries.map((c) => c.name.common)),
    [countries],
  );
  const { register, handleSubmit, watch, trigger, getFieldState, formState } =
    useForm<BaseFormIn, unknown, BaseFormOut>({
      resolver: zodResolver(schema),
      mode: 'onChange',
    });

  const { errors, isValid, isSubmitting, submitCount } = formState;
  const addSubmission = useFormStore((s) => s.addSubmission);
  const pw = watch('password');

  useEffect(() => {
    void trigger('confirmPassword');
  }, [pw, trigger]);

  const { isTouched: confirmTouched, isDirty: confirmDirty } = getFieldState(
    'confirmPassword',
    formState,
  );
  const showConfirmError = confirmTouched || confirmDirty || submitCount > 0;
  const confirmError = showConfirmError
    ? errors.confirmPassword?.message
    : undefined;

  const onSubmit: SubmitHandler<BaseFormOut> = async (data) => {
    const img = data.picture?.[0];
    const pictureBase64 = img ? await fileToBase64(img) : '';
    const submission: FormSubmission = {
      ...data,
      picture: pictureBase64,
      id: genId(),
    };
    addSubmission(submission);
    onSuccess(submission);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <InputField
        id="name-rhf"
        label="Name"
        error={errors.name?.message}
        placeholder="John"
        {...register('name')}
      />
      <InputField
        id="age-rhf"
        label="Age"
        type="number"
        inputMode="numeric"
        error={errors.age?.message}
        {...register('age')}
      />
      <InputField
        id="email-rhf"
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <div>
        <InputField
          id="password-rhf"
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />
        <PasswordStrength password={pw ?? ''} className="mt-1" />
      </div>

      <InputField
        id="confirmPassword-rhf"
        label="Confirm Password"
        type="password"
        error={confirmError}
        {...register('confirmPassword')}
      />

      <SelectField
        id="gender-rhf"
        label="Gender"
        error={errors.gender?.message}
        defaultValue=""
        options={[
          { value: '', label: 'Select gender', disabled: true },
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
        ]}
        {...register('gender')}
      />

      <InputField
        id="country-rhf"
        label="Country"
        list="countries-list-rhf"
        error={errors.country?.message}
        {...register('country')}
      />
      <datalist id="countries-list-rhf">
        {countries.map((c) => (
          <option key={c.name.common} value={c.name.common} />
        ))}
      </datalist>

      <FileField
        id="picture-rhf"
        label="Profile Picture"
        accept="image/png, image/jpeg"
        error={errors.picture?.message}
        {...register('picture')}
      />

      <CheckboxField
        id="terms-rhf"
        label="I accept the Terms and Conditions"
        error={errors.acceptTerms?.message}
        {...register('acceptTerms')}
      />

      <SubmitButton loading={isSubmitting} disabled={!isValid}>
        Submit
      </SubmitButton>
    </form>
  );
}
