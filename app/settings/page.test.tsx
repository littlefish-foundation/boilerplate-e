import { render } from '@testing-library/react'
import Page from './page'
import { cookies } from 'next/headers'
import * as jose from 'jose'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

// Mock the SettingsPage component
jest.mock('./settingsPage', () => ({
  __esModule: true,
  default: function MockSettingsPage() {
    return <div>Settings Page</div>
  }
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

jest.mock('jose', () => ({
  jwtVerify: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn().mockReturnValue({
      cookies: {
        set: jest.fn(),
      },
    }),
  },
}))

global.fetch = jest.fn()

describe('Settings Page Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ROOT_URL = 'http://localhost:3000'
    process.env.JWT_SECRET = 'test-secret'
  });

  it('should redirect to login if no auth token is present', async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    })
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    })

    await Page()

    expect(redirect).toHaveBeenCalledWith('/login')
  })

  it('should set cookie_support_check if it doesn\'t exist', async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockImplementation((name) => 
        name === 'auth-token' ? { value: 'valid-token' } : null
      ),
    })
    ;(jose.jwtVerify as jest.Mock).mockResolvedValue({
      payload: { walletAddress: '123', email: 'test@example.com', walletNetwork: 0, verifiedPolicy: 'admin' },
    })
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    })

    const result = await Page()
    
    expect(result).toEqual(expect.objectContaining({
      cookies: expect.objectContaining({
        set: expect.any(Function),
      }),
    }))
    expect((result as NextResponse<unknown>).cookies.set).toHaveBeenCalledWith({
      name: 'cookie_support_check',
      value: '1',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 86400,
      path: '/',
    })
  })

  it('should redirect to home if user is not admin', async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockImplementation((name) => 
        name === 'auth-token' ? { value: 'valid-token' } : { value: '1' }
      ),
    })
    ;(jose.jwtVerify as jest.Mock).mockResolvedValue({
      payload: { walletAddress: '123', email: 'test@example.com', walletNetwork: 0, verifiedPolicy: 'user' },
    })
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    })

    await Page()

    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('should render SettingsPage if user is admin', async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockImplementation((name) => 
        name === 'auth-token' ? { value: 'valid-token' } : { value: '1' }
      ),
    })
    ;(jose.jwtVerify as jest.Mock).mockResolvedValue({
      payload: { walletAddress: '123', email: 'test@example.com', walletNetwork: 0, verifiedPolicy: 'admin' },
    })
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    })

    const result = await Page()

    expect(result.type.name).toBe('MockSettingsPage')
  })

  it('should throw an error if fetching policies fails', async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: 'valid-token' }),
    })
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    })

    await expect(Page()).rejects.toThrow('Failed to fetch policies: Not Found')
  })
})