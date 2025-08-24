import React, { useMemo, useRef, useState } from 'react';
import { formSchema } from '@/validation/form-schema';
import { fileToBase64 } from '@/lib/file-utils';
import { useFormStore } from '@/store/form-submissions';
import type { Country, FormSubmission } from '@/types';
import { InputField } from '@/components/ui/fields/input-field';
import { SelectField } from '@/components/ui/fields/select-field';
import { FileField } from '@/components/ui/fields/file-field';
import { CheckboxField } from '@/components/ui/fields/checkbox-field';
import { SubmitButton } from '@/components/ui/submit-button';
import { PasswordStrength } from '@/components/ui/password-strength';

function genId(): string {
  return `id_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

export function UncontrolledForm({
  onSuccess,
  countries,
}: {
  onSuccess: (d: FormSubmission) => void;
  countries: Country[];
}) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const addSubmission = useFormStore((s) => s.addSubmission);

  const [pwPreview, setPwPreview] = useState('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const options = useMemo(
    () => [
      { value: '', label: 'Select gender', disabled: true },
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
    ],
    [],
  );

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get('name') ?? ''),
      age: String(fd.get('age') ?? ''),
      email: String(fd.get('email') ?? ''),
      password: String(fd.get('password') ?? ''),
      confirmPassword: String(fd.get('confirmPassword') ?? ''),
      gender: String(fd.get('gender') ?? ''),
      acceptTerms: fd.get('acceptTerms') ? true : false,
      picture: fileRef.current?.files ?? new DataTransfer().files,
      country: String(fd.get('country') ?? ''),
    };

    setPwPreview(payload.password);

    const parsed = await formSchema.safeParseAsync(payload);
    if (!parsed.success) {
      const fieldErrs: Record<string, string> = {};
      for (const iss of parsed.error.issues) {
        const key = iss.path[0] as string | undefined;
        if (key && !fieldErrs[key]) fieldErrs[key] = iss.message;
      }
      setErrors(fieldErrs);
      return;
    }

    try {
      const img = fileRef.current?.files?.[0];
      const pictureBase64 = img ? await fileToBase64(img) : '';
      const submissionData: FormSubmission = {
        ...parsed.data,
        picture: pictureBase64,
        id: genId(),
      };
      addSubmission(submissionData);
      onSuccess(submissionData);
      e.currentTarget.reset();
      setErrors({});
      setPwPreview('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
      <InputField
        id="name"
        name="name"
        label="Name"
        placeholder="John"
        error={errors.name}
      />
      <InputField
        id="age"
        name="age"
        type="number"
        label="Age"
        inputMode="numeric"
        placeholder="30"
        error={errors.age}
      />
      <InputField
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="john@example.com"
        error={errors.email}
      />

      <div>
        <InputField
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          onInput={(e) => setPwPreview((e.target as HTMLInputElement).value)}
          error={errors.password}
        />
        <PasswordStrength password={pwPreview} className="mt-1" />
      </div>

      <InputField
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        placeholder="••••••••"
        error={errors.confirmPassword}
      />

      <SelectField
        id="gender"
        name="gender"
        label="Gender"
        options={options}
        defaultValue=""
        error={errors.gender}
      />

      <InputField
        id="country"
        name="country"
        label="Country"
        placeholder="Netherlands"
        list="countries-list"
        error={errors.country}
      />
      <datalist id="countries-list">
        {countries.map((c) => (
          <option key={c.name.common} value={c.name.common} />
        ))}
      </datalist>

      <FileField
        ref={fileRef}
        id="picture"
        name="picture"
        label="Profile Picture"
        accept="image/png, image/jpeg"
        hint="PNG/JPEG, до 1MB"
        error={errors.picture}
      />

      <CheckboxField
        id="acceptTerms"
        name="acceptTerms"
        label="I accept the Terms and Conditions"
        error={errors.acceptTerms}
      />

      <SubmitButton>Submit</SubmitButton>
    </form>
  );
}
