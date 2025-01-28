import { render } from '@testing-library/react'
import Page from './page'
import { cookies } from 'next/headers'
import * as jose from 'jose'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

// Mock the TokenGatedDemoPage component
jest.mock('./asset1page', () => ({
  __esModule: true,
  default: function MockTokenGatedDemoPage() {
    return <div>Token Gated Demo Page</div>
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

describe('Page Component', () => {
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
      json: jest.fn().mockResolvedValue([{ id: '1', policyID: 'policy1' }]),
    })

    await Page()

    expect(redirect).toHaveBeenCalledWith('/login')
    expect(jose.jwtVerify).not.toHaveBeenCalled()
  })

  it('should set cookie_support_check if it doesn\'t exist', async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockImplementation((name) => 
        name === 'auth-token' ? { value: 'valid-token' } : null
      ),
    })
    ;(jose.jwtVerify as jest.Mock).mockResolvedValue({
      payload: { walletAddress: '123', email: 'test@example.com', walletNetwork: 0, verifiedPolicy: 'policy1' },
    })
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([{ id: '1', policyID: 'policy1' }]),
    })

    await Page()

    expect(NextResponse.next).toHaveBeenCalled()
    expect(NextResponse.next().cookies.set).toHaveBeenCalledWith({
      name: 'cookie_support_check',
      value: '1',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 86400,
      path: '/',
    })
  })

  it('should redirect to home if policy doesn\'t match', async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockImplementation((name) => 
        name === 'auth-token' ? { value: 'valid-token' } : { value: '1' }
      ),
    })
    ;(jose.jwtVerify as jest.Mock).mockResolvedValue({
      payload: { walletAddress: '123', email: 'test@example.com', walletNetwork: 0, verifiedPolicy: 'policy2' },
    })
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([{ id: '1', policyID: 'policy1' }]),
    })

    await Page()

    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('should render TokenGatedDemoPage if everything is valid', async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockImplementation((name) => 
        name === 'auth-token' ? { value: 'valid-token' } : { value: '1' }
      ),
    })
    ;(jose.jwtVerify as jest.Mock).mockResolvedValue({
      payload: { walletAddress: '123', email: 'test@example.com', walletNetwork: 0, verifiedPolicy: 'policy1' },
    })
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([{ id: '1', policyID: 'policy1' }]),
    })

    const result = await Page()

    expect(result!.type.name).toBe('MockTokenGatedDemoPage')
  })

  it('should throw an error if fetching policies fails', async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: 'valid-token' }),
    })
    ;(jose.jwtVerify as jest.Mock).mockResolvedValue({
      payload: { walletAddress: '123', email: 'test@example.com', walletNetwork: 0, verifiedPolicy: 'policy1' },
    })
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    })

    await expect(Page()).rejects.toThrow('Failed to fetch policies: Not Found')
  })
})