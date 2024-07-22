import { loginWithMail } from './loginActions';
import { cookies } from "next/headers";

jest.mock('crypto', () => ({
  randomBytes: jest.fn(() => ({ toString: () => 'mocked-nonce' })),
}));

const setCookieMock = jest.fn();

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    set: setCookieMock,
  })),
}));

global.fetch = jest.fn();

describe('Login Actions', () => {
  const originalEnv = process.env;
  const originalConsoleError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, ROOT_URL: 'http://localhost:3000' };
    console.error = jest.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
    console.error = originalConsoleError;
  });

  it('fetch mock should return correct response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ token: 'mocked-token' }),
    });

    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
    });

    const data = await response.json();
    expect(response.ok).toBe(true);
    expect(data.token).toBe('mocked-token');
  });

  describe('Cookie setting in different environments', () => {
    it('should set secure flag on cookie in production environment', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        configurable: true
      });

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ token: 'mocked-token' }),
      });

      await loginWithMail('test@example.com', 'password123');

      console.log('Setting cookie in production environment');
      expect(setCookieMock).toHaveBeenCalledWith('auth-token', 'mocked-token', expect.objectContaining({
        secure: true,
      }));

      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalNodeEnv,
        configurable: true
      });
    });

    it('should not set secure flag on cookie in non-production environment', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        configurable: true
      });

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ token: 'mocked-token' }),
      });

      await loginWithMail('test@example.com', 'password123');

      console.log('Setting cookie in non-production environment');
      expect(setCookieMock).toHaveBeenCalledWith('auth-token', 'mocked-token', expect.objectContaining({
        secure: false,
      }));

      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalNodeEnv,
        configurable: true
      });
    });
  });
});
