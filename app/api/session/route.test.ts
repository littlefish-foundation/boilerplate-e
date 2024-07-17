import { GET } from './route';
import { cookies } from 'next/headers';
import * as jose from 'jose';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('jose', () => ({
  jwtVerify: jest.fn(),
}));

describe('Authentication API', () => {
  let mockCookies: {
    get: jest.Mock;
    set: jest.Mock;
  };

  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, JWT_SECRET: 'test_secret', NODE_ENV: 'test' };

    mockCookies = {
      get: jest.fn(),
      set: jest.fn(),
    };
    (cookies as jest.Mock).mockReturnValue(mockCookies);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return user data when authenticated with a valid token', async () => {
    mockCookies.get.mockImplementation((name: string) => {
      if (name === 'auth-token') {
        return { value: 'valid.jwt.token' };
      }
      return null;
    });

    (jose.jwtVerify as jest.Mock).mockResolvedValue({
      payload: {
        walletAddress: 'wallet123',
        email: 'test@example.com',
        walletNetwork: 1,
        verifiedPolicy: 'policy123',
      },
    });

    const response = await GET({} as Request);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toEqual({
      walletAddress: 'wallet123',
      email: 'test@example.com',
      walletNetwork: 1,
      verifiedPolicy: 'policy123',
    });

    expect(mockCookies.set).toHaveBeenCalledWith('cookie_support_check', '1', expect.objectContaining({
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60,
      path: '/',
    }));
  });

  it('should not set cookie_support_check if it already exists', async () => {
    mockCookies.get.mockImplementation((name: string) => {
      if (name === 'auth-token') {
        return { value: 'valid.jwt.token' };
      }
      if (name === 'cookie_support_check') {
        return { value: '1' };
      }
      return null;
    });

    (jose.jwtVerify as jest.Mock).mockResolvedValue({
      payload: {
        walletAddress: 'wallet123',
        email: 'test@example.com',
        walletNetwork: 1,
        verifiedPolicy: 'policy123',
      },
    });

    await GET({} as Request);

    expect(mockCookies.set).not.toHaveBeenCalled();
  });

  it('should return 401 when no auth-token cookie is present', async () => {
    mockCookies.get.mockReturnValue(null);

    const response = await GET({} as Request);
    const responseBody = await response.json();

    expect(response.status).toBe(401);
    expect(responseBody).toEqual({ error: 'Not authenticated' });
  });

  it('should return 401 when the token is invalid', async () => {
    mockCookies.get.mockReturnValue({ value: 'invalid.jwt.token' });

    (jose.jwtVerify as jest.Mock).mockRejectedValue(new Error('Invalid token'));

    const response = await GET({} as Request);
    const responseBody = await response.json();

    expect(response.status).toBe(401);
    expect(responseBody).toEqual({ error: 'Invalid token' });
  });

  it('should set secure flag on cookie in production environment', async () => {
    process.env = { ...process.env, NODE_ENV: 'production' };

    mockCookies.get.mockImplementation((name: string) => {
      if (name === 'auth-token') {
        return { value: 'valid.jwt.token' };
      }
      return null;
    });

    (jose.jwtVerify as jest.Mock).mockResolvedValue({
      payload: {
        walletAddress: 'wallet123',
        email: 'test@example.com',
        walletNetwork: 1,
        verifiedPolicy: 'policy123',
      },
    });

    await GET({} as Request);

    expect(mockCookies.set).toHaveBeenCalledWith('cookie_support_check', '1', expect.objectContaining({
      secure: true,
    }));
  });
});