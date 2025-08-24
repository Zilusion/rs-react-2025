import { describe, it, expect } from 'vitest';
import { makeFormSchema } from '@/validation/form-schema';

interface SimpleIssue {
  path: (string | number)[];
  message: string;
}

function createFileList(files: File[]): FileList {
  const fl: Partial<FileList> & Record<number, File> = {
    length: files.length,
    item(index: number): File | null {
      return fl[index] ?? null;
    },
  };
  files.forEach((f: File, i: number) => {
    fl[i] = f;
  });
  const proto =
    (globalThis as unknown as { FileList?: { prototype: object } }).FileList
      ?.prototype ?? Object.prototype;
  Object.setPrototypeOf(fl, proto);
  return fl as FileList;
}

describe('formSchema (via makeFormSchema)', () => {
  const allowedCountries = ['Netherlands', 'Argentina', 'Brazil'] as const;
  const schema = makeFormSchema([...allowedCountries]);

  const validPngSmall = new File([new Uint8Array(10)], 'avatar.png', {
    type: 'image/png',
  });
  const validFileList = createFileList([validPngSmall]);

  it('parses valid payload and coerces age to number', async () => {
    const data = {
      name: 'John',
      age: '23',
      email: 'john@example.com',
      password: 'Aa1!aaaa',
      confirmPassword: 'Aa1!aaaa',
      gender: 'male' as const,
      acceptTerms: true as const,
      picture: validFileList,
      country: 'Netherlands',
    };

    const res = await schema.safeParseAsync(data);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(typeof res.data.age).toBe('number');
      expect(res.data.age).toBe(23);
    }
  });

  it('fails if name does not start with capital letter', async () => {
    const res = await schema.safeParseAsync({
      name: 'john',
      age: '25',
      email: 'john@example.com',
      password: 'Aa1!aaaa',
      confirmPassword: 'Aa1!aaaa',
      gender: 'male',
      acceptTerms: true,
      picture: validFileList,
      country: 'Netherlands',
    });

    expect(res.success).toBe(false);
    if (!res.success) {
      const issues = res.error.issues as readonly SimpleIssue[];
      const issue = issues.find((iss: SimpleIssue) => iss.path[0] === 'name');
      expect(issue?.message).toBe('Name must start with a capital letter.');
    }
  });

  it('fails when age is negative and when not a number', async () => {
    const neg = await schema.safeParseAsync({
      name: 'John',
      age: '-1',
      email: 'john@example.com',
      password: 'Aa1!aaaa',
      confirmPassword: 'Aa1!aaaa',
      gender: 'male',
      acceptTerms: true,
      picture: validFileList,
      country: 'Netherlands',
    });
    expect(neg.success).toBe(false);
    if (!neg.success) {
      const issues = neg.error.issues as readonly SimpleIssue[];
      const issue = issues.find((iss: SimpleIssue) => iss.path[0] === 'age');
      expect(issue?.message).toBe('Age should be a positive number.');
    }

    const nan = await schema.safeParseAsync({
      name: 'John',
      age: 'abc',
      email: 'john@example.com',
      password: 'Aa1!aaaa',
      confirmPassword: 'Aa1!aaaa',
      gender: 'male',
      acceptTerms: true,
      picture: validFileList,
      country: 'Netherlands',
    });
    expect(nan.success).toBe(false);
    if (!nan.success) {
      const issues = nan.error.issues as readonly SimpleIssue[];
      const issue = issues.find((iss: SimpleIssue) => iss.path[0] === 'age');
      expect(issue?.message).toBe('Age must be a number.');
    }
  });

  it('validates email format', async () => {
    const res = await schema.safeParseAsync({
      name: 'John',
      age: '25',
      email: 'not-an-email',
      password: 'Aa1!aaaa',
      confirmPassword: 'Aa1!aaaa',
      gender: 'male',
      acceptTerms: true,
      picture: validFileList,
      country: 'Netherlands',
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      const issues = res.error.issues as readonly SimpleIssue[];
      const issue = issues.find((iss: SimpleIssue) => iss.path[0] === 'email');
      expect(issue?.message).toBe('Invalid email address.');
    }
  });

  it('requires password rules and min length', async () => {
    const short = await schema.safeParseAsync({
      name: 'John',
      age: '25',
      email: 'john@example.com',
      password: 'Aa1!',
      confirmPassword: 'Aa1!',
      gender: 'male',
      acceptTerms: true,
      picture: validFileList,
      country: 'Netherlands',
    });
    expect(short.success).toBe(false);
    if (!short.success) {
      const issues = short.error.issues as readonly SimpleIssue[];
      const issue = issues.find(
        (iss: SimpleIssue) => iss.path[0] === 'password',
      );
      expect(issue?.message).toBe(
        'Password must be at least 8 characters long.',
      );
    }

    const noSpecial = await schema.safeParseAsync({
      name: 'John',
      age: '25',
      email: 'john@example.com',
      password: 'Aa1aaaaa',
      confirmPassword: 'Aa1aaaaa',
      gender: 'male',
      acceptTerms: true,
      picture: validFileList,
      country: 'Netherlands',
    });
    expect(noSpecial.success).toBe(false);
    if (!noSpecial.success) {
      const issues = noSpecial.error.issues as readonly SimpleIssue[];
      const issue = issues.find(
        (iss: SimpleIssue) => iss.path[0] === 'password',
      );
      expect(issue?.message).toBe(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      );
    }
  });

  it('shows mismatch error on confirmPassword when pw fields valid', async () => {
    const res = await schema.safeParseAsync({
      name: 'John',
      age: '-1',
      email: 'john@example.com',
      password: 'Aa1!aaaa',
      confirmPassword: 'Aa1!bbbb',
      gender: 'male',
      acceptTerms: true,
      picture: validFileList,
      country: 'Netherlands',
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      const issues = res.error.issues as readonly SimpleIssue[];
      const confErr = issues.find(
        (iss: SimpleIssue) => iss.path[0] === 'confirmPassword',
      );
      expect(confErr?.message).toBe("Passwords don't match");
      const ageErr = issues.find((iss: SimpleIssue) => iss.path[0] === 'age');
      expect(ageErr).toBeTruthy();
    }
  });

  it('does NOT run mismatch check when password itself invalid (via `when`)', async () => {
    const res = await schema.safeParseAsync({
      name: 'John',
      age: '25',
      email: 'john@example.com',
      password: 'A1!',
      confirmPassword: 'A1!',
      gender: 'male',
      acceptTerms: true,
      picture: validFileList,
      country: 'Netherlands',
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      const issues = res.error.issues as readonly SimpleIssue[];
      const confErr = issues.find(
        (iss: SimpleIssue) => iss.path[0] === 'confirmPassword',
      );
      expect(confErr?.message).not.toBe("Passwords don't match");
      const pwErr = issues.find(
        (iss: SimpleIssue) => iss.path[0] === 'password',
      );
      expect(pwErr).toBeTruthy();
    }
  });

  it('requires accepting terms', async () => {
    const res = await schema.safeParseAsync({
      name: 'John',
      age: '25',
      email: 'john@example.com',
      password: 'Aa1!aaaa',
      confirmPassword: 'Aa1!aaaa',
      gender: 'male',
      acceptTerms: false,
      picture: validFileList,
      country: 'Netherlands',
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      const issues = res.error.issues as readonly SimpleIssue[];
      const issue = issues.find(
        (iss: SimpleIssue) => iss.path[0] === 'acceptTerms',
      );
      expect(issue?.message).toBe('You must accept the Terms and Conditions.');
    }
  });

  it('validates picture: required, size limit, mime type', async () => {
    const emptyList = createFileList([]);
    const required = await schema.safeParseAsync({
      name: 'John',
      age: '25',
      email: 'john@example.com',
      password: 'Aa1!aaaa',
      confirmPassword: 'Aa1!aaaa',
      gender: 'male',
      acceptTerms: true,
      picture: emptyList,
      country: 'Netherlands',
    });
    expect(required.success).toBe(false);
    if (!required.success) {
      const issues = required.error.issues as readonly SimpleIssue[];
      const issue = issues.find(
        (iss: SimpleIssue) => iss.path[0] === 'picture',
      );
      expect(issue?.message).toBe('Image is required.');
    }

    const bigBytes = 1024 * 1024 + 1;
    const big = new File([new Uint8Array(bigBytes)], 'big.png', {
      type: 'image/png',
    });
    const tooLarge = await schema.safeParseAsync({
      name: 'John',
      age: '25',
      email: 'john@example.com',
      password: 'Aa1!aaaa',
      confirmPassword: 'Aa1!aaaa',
      gender: 'male',
      acceptTerms: true,
      picture: createFileList([big]),
      country: 'Netherlands',
    });
    expect(tooLarge.success).toBe(false);
    if (!tooLarge.success) {
      const issues = tooLarge.error.issues as readonly SimpleIssue[];
      const issue = issues.find(
        (iss: SimpleIssue) => iss.path[0] === 'picture',
      );
      expect(issue?.message).toBe('Max file size is 1MB.');
    }

    const gif = new File([new Uint8Array(10)], 'a.gif', { type: 'image/gif' });
    const wrongMime = await schema.safeParseAsync({
      name: 'John',
      age: '25',
      email: 'john@example.com',
      password: 'Aa1!aaaa',
      confirmPassword: 'Aa1!aaaa',
      gender: 'male',
      acceptTerms: true,
      picture: createFileList([gif]),
      country: 'Netherlands',
    });
    expect(wrongMime.success).toBe(false);
    if (!wrongMime.success) {
      const issues = wrongMime.error.issues as readonly SimpleIssue[];
      const issue = issues.find(
        (iss: SimpleIssue) => iss.path[0] === 'picture',
      );
      expect(issue?.message).toContain('Only jpeg, png formats are supported.');
    }
  });

  it('requires country (empty string)', async () => {
    const res = await schema.safeParseAsync({
      name: 'John',
      age: '25',
      email: 'john@example.com',
      password: 'Aa1!aaaa',
      confirmPassword: 'Aa1!aaaa',
      gender: 'male',
      acceptTerms: true,
      picture: validFileList,
      country: '',
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      const issues = res.error.issues as readonly SimpleIssue[];
      const issue = issues.find(
        (iss: SimpleIssue) => iss.path[0] === 'country',
      );
      expect(issue?.message).toBe('Please select a country.');
    }
  });

  it('rejects country not in allowed list', async () => {
    const res = await schema.safeParseAsync({
      name: 'John',
      age: '25',
      email: 'john@example.com',
      password: 'Aa1!aaaa',
      confirmPassword: 'Aa1!aaaa',
      gender: 'male',
      acceptTerms: true,
      picture: validFileList,
      country: 'Atlantis',
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      const issues = res.error.issues as readonly SimpleIssue[];
      const issue = issues.find(
        (iss: SimpleIssue) => iss.path[0] === 'country',
      );
      expect(issue?.message).toBe('Please pick a country from the list.');
    }
  });
});
