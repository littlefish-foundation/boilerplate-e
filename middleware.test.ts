import { middleware } from './middleware';
import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn(),
    redirect: jest.fn(),
  },
}));

jest.mock('jose', () => ({
  jwtVerify: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      { id: '1', policyID: 'policy1', createdAt: '', updatedAt: '' },
      { id: '2', policyID: 'policy2', createdAt: '', updatedAt: '' },
    ]),
  } as Response)
);

describe('Middleware', () => {
  let mockRequest: NextRequest;
  
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ROOT_URL = 'http://localhost:3000';
    process.env.JWT_SECRET = 'test-secret';
    
    mockRequest = {
      nextUrl: new URL('http://localhost:3000'),
      url: 'http://localhost:3000',
      cookies: {
        has: jest.fn(),
        get: jest.fn(),
        getAll: jest.fn(),
        set: jest.fn(),
        delete: jest.fn(),
        clear: jest.fn(),
      } as any,
      headers: new Headers(),
    } as NextRequest;
  });

  it('should allow access to /cookies-required', async () => {
    mockRequest.nextUrl.pathname = '/cookies-required';
    await middleware(mockRequest);
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('should redirect to /cookies-required if cookies are not supported', async () => {
    mockRequest.cookies.has = jest.fn()
      .mockReturnValueOnce(true)  // cookie_check_performed
      .mockReturnValueOnce(false);  // cookie_support_check
    await middleware(mockRequest);
    expect(NextResponse.redirect).toHaveBeenCalledWith(expect.any(URL));
  });

  it('should redirect to /login if no auth token is present on protected routes', async () => {
    mockRequest.nextUrl.pathname = '/settings';
    mockRequest.cookies.has = jest.fn().mockReturnValue(true);
    mockRequest.cookies.get = jest.fn().mockReturnValue(undefined);
    await middleware(mockRequest);
    expect(NextResponse.redirect).toHaveBeenCalledWith(expect.any(URL));
  });

  it('should allow access to protected routes with valid token', async () => {
    mockRequest.nextUrl.pathname = '/dashboard';
    mockRequest.cookies.has = jest.fn().mockReturnValue(true);
    mockRequest.cookies.get = jest.fn().mockReturnValue({ value: 'valid-token' } as any);
    (jose.jwtVerify as jest.Mock).mockResolvedValue({
      payload: { sub: '123', email: 'test@example.com', verifiedPolicy: 'policy1' }
    });
    await middleware(mockRequest);
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('should redirect to home for non-admin accessing admin routes', async () => {
    mockRequest.nextUrl.pathname = '/settings';
    mockRequest.cookies.has = jest.fn().mockReturnValue(true);
    mockRequest.cookies.get = jest.fn().mockReturnValue({ value: 'valid-token' } as any);
    (jose.jwtVerify as jest.Mock).mockResolvedValue({
      payload: { sub: '123', email: 'test@example.com', verifiedPolicy: 'policy1' }
    });
    await middleware(mockRequest);
    expect(NextResponse.redirect).toHaveBeenCalledWith(expect.any(URL));
  });

  it('should allow admin access to admin routes', async () => {
    mockRequest.nextUrl.pathname = '/settings';
    mockRequest.cookies.has = jest.fn().mockReturnValue(true);
    mockRequest.cookies.get = jest.fn().mockReturnValue({ value: 'valid-token' });
    (jose.jwtVerify as jest.Mock).mockResolvedValue({
      payload: { sub: '123', email: 'test@example.com', verifiedPolicy: 'admin' }
    });
    await middleware(mockRequest as NextRequest);
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('should redirect to home for users without required policy for asset routes', async () => {
    mockRequest.nextUrl.pathname = '/asset1';
    mockRequest.cookies.has = jest.fn().mockReturnValue(true);
    mockRequest.cookies.get = jest.fn().mockReturnValue({ value: 'valid-token' });
    (jose.jwtVerify as jest.Mock).mockResolvedValue({
      payload: { sub: '123', email: 'test@example.com', verifiedPolicy: 'policy2' }
    });
    await middleware(mockRequest as NextRequest);
    expect(NextResponse.redirect).toHaveBeenCalledWith(expect.any(URL));
  });

  it('should allow access to asset routes with correct policy', async () => {
    mockRequest.nextUrl.pathname = '/asset1';
    mockRequest.cookies.has = jest.fn().mockReturnValue(true);
    mockRequest.cookies.get = jest.fn().mockReturnValue({ value: 'valid-token' });
    (jose.jwtVerify as jest.Mock).mockResolvedValue({
      payload: { sub: '123', email: 'test@example.com', verifiedPolicy: 'policy1' }
    });
    await middleware(mockRequest as NextRequest);
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('should add user info to headers for authenticated requests', async () => {
    mockRequest.nextUrl.pathname = '/dashboard';
    mockRequest.cookies.has = jest.fn().mockReturnValue(true);
    mockRequest.cookies.get = jest.fn().mockReturnValue({ value: 'valid-token' });
    (jose.jwtVerify as jest.Mock).mockResolvedValue({
      payload: { sub: '123', email: 'test@example.com', verifiedPolicy: 'policy1' }
    });
    await middleware(mockRequest as NextRequest);
    expect(NextResponse.next).toHaveBeenCalledWith(expect.objectContaining({
      request: expect.objectContaining({
        headers: expect.any(Headers)
      })
    }));
  });

  it('should handle JWT verification errors', async () => {
    mockRequest.nextUrl.pathname = '/dashboard';
    mockRequest.cookies.has = jest.fn().mockReturnValue(true);
    mockRequest.cookies.get = jest.fn().mockReturnValue({ value: 'invalid-token' });
    (jose.jwtVerify as jest.Mock).mockRejectedValue(new Error('Invalid token'));
    await middleware(mockRequest as NextRequest);
    expect(NextResponse.redirect).toHaveBeenCalledWith(expect.any(URL));
  });
});