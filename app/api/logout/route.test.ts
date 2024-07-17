import { POST } from './route';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Mock the cookies function
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('Logout API', () => {
  let mockCookies: {
    delete: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up mock cookies
    mockCookies = {
      delete: jest.fn(),
    };
    (cookies as jest.Mock).mockReturnValue(mockCookies);

    // Set up mock NextResponse.json
    (NextResponse.json as jest.Mock).mockImplementation((body, options) => ({
      status: options?.status || 200,
      json: async () => body,
    }));
  });

  it('should successfully logout and delete auth-token cookie', async () => {
    const response = await POST();
    const responseBody = await response.json();

    expect(mockCookies.delete).toHaveBeenCalledWith('auth-token');
    expect(response.status).toBe(200);
    expect(responseBody).toEqual({ message: 'Logged out successfully' });
  });

  it('should handle errors during logout', async () => {
    // Simulate an error when deleting the cookie
    mockCookies.delete.mockImplementation(() => {
      throw new Error('Failed to delete cookie');
    });

    // Mock console.error to prevent error output during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const response = await POST();
    const responseBody = await response.json();

    expect(mockCookies.delete).toHaveBeenCalledWith('auth-token');
    expect(response.status).toBe(500);
    expect(responseBody).toEqual({ error: 'Failed to logout' });
    expect(console.error).toHaveBeenCalledWith('Error during logout:', expect.any(Error));
  });
});