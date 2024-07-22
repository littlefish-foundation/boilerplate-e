import '@testing-library/jest-dom';

// Polyfill for TextEncoder and TextDecoder
if (typeof TextEncoder === 'undefined' || typeof TextDecoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock Next.js cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
  })),
}));

// Improved Custom Response class for testing
class CustomResponse {
  constructor(body, init = {}) {
    this._body = body;
    this.status = init.status || 200;
    this.headers = new Map(Object.entries(init.headers || {}));
    this.ok = this.status >= 200 && this.status < 300;
  }

  json() {
    return Promise.resolve(JSON.parse(this._body));
  }

  text() {
    return Promise.resolve(this._body);
  }

  static json(body, init = {}) {
    return new CustomResponse(JSON.stringify(body), {
      ...init,
      headers: {
        ...init.headers,
        'Content-Type': 'application/json',
      },
    });
  }
}

global.Response = CustomResponse;

// Polyfill for fetch
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

// Mock Next.js routing
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock environment variables
process.env.JWT_SECRET = 'test-secret';

// Mock littlefish-nft-auth-framework
jest.mock('littlefish-nft-auth-framework/frontend', () => ({
  useWallet: jest.fn(() => ({
    isConnected: false,
    connectedWallet: null,
    networkID: 1,
    addresses: ['test-address'],
    assets: [],
    decodeHexToAscii: jest.fn(assets => assets),
    wallets: [{ name: 'Test Wallet', icon: 'test-icon' }],
    connectWallet: jest.fn(),
    disconnectWallet: jest.fn(),
  })),
  signMessage: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});