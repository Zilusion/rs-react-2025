import { describe, it, expect } from 'vitest';
import { fileToBase64 } from '@/lib/file-utils';

describe('fileToBase64', () => {
  it('converts file to base64 data URL', async () => {
    const blob = new Blob([new TextEncoder().encode('hello')], {
      type: 'text/plain',
    });
    const file = new File([blob], 'hello.txt', { type: 'text/plain' });

    const res = await fileToBase64(file);
    expect(res.startsWith('data:text/plain;base64,')).toBe(true);
    expect(res).toContain('aGVsbG8=');
  });

  it('rejects when FileReader errors', async () => {
    const OriginalFR = globalThis.FileReader;

    class MockFileReader implements Partial<FileReader> {
      public result: string | ArrayBuffer | null = null;
      public onload:
        | ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown)
        | null = null;
      public onerror:
        | ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown)
        | null = null;

      readAsDataURL(): void {
        setTimeout(() => {
          if (this.onerror) {
            const evt = new ProgressEvent(
              'error',
            ) as unknown as ProgressEvent<FileReader>;
            this.onerror.call(this as unknown as FileReader, evt);
          }
        }, 0);
      }
    }

    globalThis.FileReader = MockFileReader as unknown as typeof FileReader;

    const file = new File([new Uint8Array([1, 2, 3])], 'x.bin', {
      type: 'application/octet-stream',
    });
    await expect(fileToBase64(file)).rejects.toBeInstanceOf(ProgressEvent);

    globalThis.FileReader = OriginalFR;
  });
});
