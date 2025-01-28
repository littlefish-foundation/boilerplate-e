import { GET } from './route';
import { cookies } from 'next/headers';
import * as jose from 'jose';

jest.mock('next/headers', () => ({
    cookies: jest.fn(),
}));

jest.mock('jose', () => ({
    jwtVerify: jest.fn(),
}));

describe('Authentication Check API', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env = { ...originalEnv, JWT_SECRET: 'test_secret' };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('should return user data when authenticated with a valid token', async () => {
        const mockCookies = {
            get: jest.fn().mockImplementation((name) => {
                if (name === 'auth-token') return { value: 'valid.jwt.token' };
                return null;
            }),
            set: jest.fn(),
        };
        (cookies as jest.Mock).mockReturnValue(mockCookies);

        (jose.jwtVerify as jest.Mock).mockResolvedValue({
            payload: {
                walletAddress: 'wallet123',
                email: 'test@example.com',
                walletNetwork: 1,
                roles: 'policy123',
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
        expect(mockCookies.set).toHaveBeenCalledWith('cookie_support_check', '1', expect.any(Object));
    });

    it('should return 401 when no auth-token cookie is present', async () => {
        const mockCookies = {
            get: jest.fn().mockReturnValue(null),
            set: jest.fn(),
        };
        (cookies as jest.Mock).mockReturnValue(mockCookies);

        const response = await GET({} as Request);
        const responseBody = await response.json();

        expect(response.status).toBe(401);
        expect(responseBody).toEqual({ error: 'Not authenticated' });
    });

    it('should return 401 when the token is invalid', async () => {
        const mockCookies = {
            get: jest.fn().mockReturnValue({ value: 'invalid.jwt.token' }),
            set: jest.fn(),
        };
        (cookies as jest.Mock).mockReturnValue(mockCookies);

        (jose.jwtVerify as jest.Mock).mockRejectedValue(new Error('Invalid token'));

        const response = await GET({} as Request);
        const responseBody = await response.json();

        expect(response.status).toBe(401);
        expect(responseBody).toEqual({ error: 'Invalid token' });
    });

    it('should return 403 when cookie access is blocked', async () => {
        (cookies as jest.Mock).mockImplementation(() => {
            throw new Error('Cookies are not available');
        });

        const response = await GET({} as Request);
        const responseBody = await response.json();

        expect(response.status).toBe(403);
        expect(responseBody).toEqual({ error: 'Cookie access blocked' });
    });

    it('should not set cookie_support_check if it already exists', async () => {
        const mockCookies = {
            get: jest.fn().mockImplementation((name) => {
                if (name === 'auth-token') return { value: 'valid.jwt.token' };
                if (name === 'cookie_support_check') return { value: '1' };
                return null;
            }),
            set: jest.fn(),
        };
        (cookies as jest.Mock).mockReturnValue(mockCookies);

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

    it('should set secure flag on cookie in production-like environment', async () => {
        const mockCookies = {
            get: jest.fn().mockImplementation((name) => {
                if (name === 'auth-token') return { value: 'valid.jwt.token' };
                return null;
            }),
            set: jest.fn(),
        };
        (cookies as jest.Mock).mockReturnValue(mockCookies);

        (jose.jwtVerify as jest.Mock).mockResolvedValue({
            payload: {
                walletAddress: 'wallet123',
                email: 'test@example.com',
                walletNetwork: 1,
                verifiedPolicy: 'policy123',
            },
        });

        // Simulate production environment
        const originalNodeEnv = process.env.NODE_ENV;
        Object.defineProperty(process.env, 'NODE_ENV', {
            value: 'production',
            configurable: true
        });

        await GET({} as Request);

        expect(mockCookies.set).toHaveBeenCalledWith('cookie_support_check', '1', expect.objectContaining({
            secure: true,
        }));

        // Restore original NODE_ENV
        Object.defineProperty(process.env, 'NODE_ENV', {
            value: originalNodeEnv,
            configurable: true
        });
    });

    it('should not set secure flag on cookie in non-production environment', async () => {
        const mockCookies = {
            get: jest.fn().mockImplementation((name) => {
                if (name === 'auth-token') return { value: 'valid.jwt.token' };
                return null;
            }),
            set: jest.fn(),
        };
        (cookies as jest.Mock).mockReturnValue(mockCookies);

        (jose.jwtVerify as jest.Mock).mockResolvedValue({
            payload: {
                walletAddress: 'wallet123',
                email: 'test@example.com',
                walletNetwork: 1,
                verifiedPolicy: 'policy123',
            },
        });

        // Ensure non-production environment
        const originalNodeEnv = process.env.NODE_ENV;
        Object.defineProperty(process.env, 'NODE_ENV', {
            value: 'development',
            configurable: true
        });

        await GET({} as Request);

        expect(mockCookies.set).toHaveBeenCalledWith('cookie_support_check', '1', expect.objectContaining({
            secure: false,
        }));

        // Restore original NODE_ENV
        Object.defineProperty(process.env, 'NODE_ENV', {
            value: originalNodeEnv,
            configurable: true
        });
    });
});