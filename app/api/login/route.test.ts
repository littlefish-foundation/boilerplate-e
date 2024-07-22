import { POST } from './route';
import prisma from "@/app/lib/prisma";
import { loginUser, setConfig } from "littlefish-nft-auth-framework/backend";
import * as jose from "jose";

jest.mock("@/app/lib/prisma", () => ({
  user: {
    findFirst: jest.fn(),
  },
  policy: {
    findMany: jest.fn(),
  },
}));

jest.mock("littlefish-nft-auth-framework/backend", () => ({
  loginUser: jest.fn(),
  setConfig: jest.fn(),
}));

jest.mock("jose", () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setIssuer: jest.fn().mockReturnThis(),
    setSubject: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue("mocked.jwt.token"),
  })),
}));

describe('POST /api/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
    process.env.PREPROD_API_KEY = 'mock-preprod-api-key';
    process.env.MAINNET_API_KEY = 'mock-mainnet-api-key';
  });

  it('should handle email login successfully', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        email: 'test@example.com',
        password: 'password123',
      }),
    };

    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      password: 'hashedpassword',
      assets: [],
    });

    (loginUser as jest.Mock).mockResolvedValue({ success: true });

    const response = await POST(mockRequest as unknown as Request);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('token');
    expect(loginUser).toHaveBeenCalledWith(
      { email: 'test@example.com', password: 'hashedpassword' },
      { email: 'test@example.com', password: 'password123' }
    );
  });

  it('should handle wallet login without assets successfully', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        walletAddress: 'stake1ux2rrlvgt6rzfzzk9rffppz6hk7h7x59yjjxcdplehpzxecvt3hqw',
        walletNetwork: 1,
        signature: 'mock_signature',
        key: 'mock_key',
        nonce: 'mock_nonce',
      }),
    };

    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: '1',
      walletAddress: 'stake1ux2rrlvgt6rzfzzk9rffppz6hk7h7x59yjjxcdplehpzxecvt3hqw',
      walletNetwork: 1,
      assets: [],
    });

    (loginUser as jest.Mock).mockResolvedValue({ success: true });

    const response = await POST(mockRequest as unknown as Request);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('token');
    expect(setConfig).toHaveBeenCalledWith('mock-mainnet-api-key', 'mainnet');
    expect(loginUser).toHaveBeenCalledWith(
      { stakeAddress: 'stake1ux2rrlvgt6rzfzzk9rffppz6hk7h7x59yjjxcdplehpzxecvt3hqw', walletNetwork: 1 },
      expect.objectContaining({
        stakeAddress: 'stake1ux2rrlvgt6rzfzzk9rffppz6hk7h7x59yjjxcdplehpzxecvt3hqw',
        walletNetwork: 1,
        signature: 'mock_signature',
        key: 'mock_key',
        nonce: 'mock_nonce',
      })
    );
  });

  it('should handle wallet login with assets successfully', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        walletAddress: 'stake1ux2rrlvgt6rzfzzk9rffppz6hk7h7x59yjjxcdplehpzxecvt3hqw',
        walletNetwork: 1,
        signature: 'mock_signature',
        key: 'mock_key',
        nonce: 'mock_nonce',
        policyID: 'policy123',
        assetName: 'asset1',
        amount: 100,
      }),
    };

    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: '1',
      walletAddress: 'stake1ux2rrlvgt6rzfzzk9rffppz6hk7h7x59yjjxcdplehpzxecvt3hqw',
      walletNetwork: 1,
      assets: [{ policyID: 'policy123', assetName: 'asset1', amount: 100 }],
    });

    (prisma.policy.findMany as jest.Mock).mockResolvedValue([{ policyID: 'policy123' }]);

    (loginUser as jest.Mock).mockResolvedValue({ success: true });

    const response = await POST(mockRequest as unknown as Request);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('token');
    expect(setConfig).toHaveBeenCalledWith('mock-mainnet-api-key', 'mainnet');
    expect(loginUser).toHaveBeenCalledWith(
      expect.objectContaining({
        stakeAddress: 'stake1ux2rrlvgt6rzfzzk9rffppz6hk7h7x59yjjxcdplehpzxecvt3hqw',
        walletNetwork: 1,
        asset: { policyID: 'policy123', assetName: 'asset1', amount: 100 },
      }),
      expect.objectContaining({
        stakeAddress: 'stake1ux2rrlvgt6rzfzzk9rffppz6hk7h7x59yjjxcdplehpzxecvt3hqw',
        walletNetwork: 1,
        signature: 'mock_signature',
        key: 'mock_key',
        nonce: 'mock_nonce',
        assets: [{ policyID: 'policy123', assetName: 'asset1', amount: 100 }],
      })
    );
  });

  it('should return 404 if user is not found', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        email: 'nonexistent@example.com',
        password: 'password123',
      }),
    };

    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

    const response = await POST(mockRequest as unknown as Request);

    expect(response.status).toBe(404);
    expect(await response.text()).toBe('User not found');
  });

  it('should return 401 if credentials are invalid', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    };

    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      password: 'hashedpassword',
      assets: [],
    });

    (loginUser as jest.Mock).mockResolvedValue({ success: false });

    const response = await POST(mockRequest as unknown as Request);

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Invalid credentials');
  });

  it('should return 400 if asset details are required but not provided', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        walletAddress: 'stake1ux2rrlvgt6rzfzzk9rffppz6hk7h7x59yjjxcdplehpzxecvt3hqw',
        walletNetwork: 1,
        signature: 'mock_signature',
        key: 'mock_key',
        nonce: 'mock_nonce',
      }),
    };

    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: '1',
      walletAddress: 'stake1ux2rrlvgt6rzfzzk9rffppz6hk7h7x59yjjxcdplehpzxecvt3hqw',
      walletNetwork: 1,
      assets: [{ policyID: 'policy123', assetName: 'asset1', amount: 100 }],
    });

    const response = await POST(mockRequest as unknown as Request);

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Asset details required for this user');
  });

  it('should return 400 if the request is invalid', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({}),
    };

    const response = await POST(mockRequest as unknown as Request);

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Invalid request');
  });
});