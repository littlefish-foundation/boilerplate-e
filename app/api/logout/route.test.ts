import { POST } from './route';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

jest.mock('next/headers', () => ({
    cookies: jest.fn(),
}));

jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn().mockImplementation((body, options) => ({
            status: options?.status || 200,
            json: async () => body,
        })),
    },
}));

describe('Logout API', () => {
    let mockCookies: {
        get: jest.Mock;
        delete: jest.Mock;
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockCookies = {
            get: jest.fn(),
            delete: jest.fn(),
        };
        (cookies as jest.Mock).mockReturnValue(mockCookies);
    });

    it('should successfully logout when auth-token is present', async () => {
        mockCookies.get.mockReturnValue({ value: 'valid-token' });

        const response = await POST();
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual({ message: 'Logged out successfully' });
        expect(mockCookies.delete).toHaveBeenCalledWith('auth-token');
    });

    it('should return 401 when auth-token is not present', async () => {
        mockCookies.get.mockReturnValue(null);

        const response = await POST();
        const responseBody = await response.json();

        expect(response.status).toBe(401);
        expect(responseBody).toEqual({ error: 'Not logged in' });
        expect(mockCookies.delete).not.toHaveBeenCalled();
    });

    it('should return 403 when cookie access is blocked', async () => {
        (cookies as jest.Mock).mockImplementation(() => {
            throw new Error('Cookies are not available');
        });

        const response = await POST();
        const responseBody = await response.json();

        expect(response.status).toBe(403);
        expect(responseBody).toEqual({ error: 'Cookie access blocked' });
    });

    it('should handle errors during logout', async () => {
        mockCookies.get.mockReturnValue({ value: 'valid-token' });
        mockCookies.delete.mockImplementation(() => {
            throw new Error('Failed to delete cookie');
        });

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        const response = await POST();
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: 'Failed to logout' });
        expect(consoleSpy).toHaveBeenCalledWith('Error during logout:', expect.any(Error));

        consoleSpy.mockRestore();
    });
});