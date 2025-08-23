import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import fetch, { Headers, Request, Response } from 'node-fetch';

expect.extend(matchers);

// @ts-expect-error 
global.fetch = fetch;
// @ts-expect-error
global.Headers = Headers;
// @ts-expect-error
global.Request = Request;
// @ts-expect-error
global.Response = Response;

afterEach(() => {
  cleanup();
});
