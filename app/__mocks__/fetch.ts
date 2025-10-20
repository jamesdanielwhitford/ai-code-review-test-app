/**
 * Mock fetch implementation for testing
 * Provides a way to mock API responses in unit tests
 */

export const mockFetchSuccess = (data: unknown) => {
  return Promise.resolve({
    json: async () => data,
    ok: true,
    status: 200,
    statusText: 'OK',
  } as Response);
};

export const mockFetchError = (message: string) => {
  return Promise.reject(new Error(message));
};

export const mockFetchJsonError = () => {
  return Promise.resolve({
    json: async () => {
      throw new Error('JSON parsing error');
    },
    ok: false,
    status: 500,
  } as Response);
};