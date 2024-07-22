import { POST } from './route';
import prisma from "@/app/lib/prisma";

jest.mock("littlefish-nft-auth-framework/backend", () => ({
  signupUser: jest.fn(),
  hashPassword: jest.fn(),
  setConfig: jest.fn(),
}));

import { signupUser, hashPassword, setConfig } from "littlefish-nft-auth-framework/backend";

jest.mock("@/app/lib/prisma", () => ({
  user: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
}));

describe('POST /api/signup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.PREPROD_API_KEY = 'mock-preprod-api-key';
    process.env.MAINNET_API_KEY = 'mock-mainnet-api-key';
    console.log("Environment variables set:", process.env.PREPROD_API_KEY, process.env.MAINNET_API_KEY);
  });

  it('should handle email signup successfully', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        email: 'test@example.com',
        password: 'password123',
      }),
    };

    (signupUser as jest.Mock).mockResolvedValue({
      success: true,
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
    });

    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (hashPassword as jest.Mock).mockReturnValue('hashedpassword');

    const response = await POST(mockRequest as unknown as Request);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toEqual({ success: true });
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: 'test@example.com',
        password: 'hashedpassword',
        emailVerified: expect.any(Date),
      },
    });
  });

  it('should handle testnet wallet signup successfully', async () => {
    console.log("Starting testnet wallet signup test");
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        walletNetwork: 0,
        stakeAddress: 'stake_test1uqrw9tjymlm8wrwq7jk68n6v7fs9qz8z0tkdkve26dylmfc2ux2hj',
        signature: 'mock_signature',
        key: 'mock_key',
        nonce: 'mock_nonce',
      }),
    };
    console.log("Mock request created:", await mockRequest.json());

    (signupUser as jest.Mock).mockResolvedValue({
      success: true,
      stakeAddress: 'stake_test1uqrw9tjymlm8wrwq7jk68n6v7fs9qz8z0tkdkve26dylmfc2ux2hj',
    });
    console.log("signupUser mock set up");

    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({});
    (setConfig as jest.Mock).mockImplementation(() => {});
    console.log("Prisma and setConfig mocks set up");

    const response = await POST(mockRequest as unknown as Request);
    console.log("Response received:", response.status);
    const responseBody = await response.json();
    console.log("Response body:", responseBody);

    expect(response.status).toBe(200);
    expect(responseBody).toEqual({ success: true });
    expect(setConfig).toHaveBeenCalledWith('mock-preprod-api-key', 'preprod');
    
    console.log("prisma.user.create calls:", (prisma.user.create as jest.Mock).mock.calls);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        walletAddress: 'stake_test1uqrw9tjymlm8wrwq7jk68n6v7fs9qz8z0tkdkve26dylmfc2ux2hj',
        walletAddressVerified: expect.any(Date),
      }),
    });
    console.log("All expectations passed");
  });

  it('should handle mainnet wallet signup successfully', async () => {
    console.log("Starting mainnet wallet signup test");
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        walletNetwork: 1,
        stakeAddress: 'stake1ux2rrlvgt6rzfzzk9rffppz6hk7h7x59yjjxcdplehpzxecvt3hqw',
        signature: 'mock_signature',
        key: 'mock_key',
        nonce: 'mock_nonce',
      }),
    };
    console.log("Mock request created:", await mockRequest.json());

    (signupUser as jest.Mock).mockResolvedValue({
      success: true,
      stakeAddress: 'stake1ux2rrlvgt6rzfzzk9rffppz6hk7h7x59yjjxcdplehpzxecvt3hqw',
    });
    console.log("signupUser mock set up");

    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({});
    (setConfig as jest.Mock).mockImplementation(() => {});
    console.log("Prisma and setConfig mocks set up");

    const response = await POST(mockRequest as unknown as Request);
    console.log("Response received:", response.status);
    const responseBody = await response.json();
    console.log("Response body:", responseBody);

    expect(response.status).toBe(200);
    expect(responseBody).toEqual({ success: true });
    expect(setConfig).toHaveBeenCalledWith('mock-mainnet-api-key', 'mainnet');
    
    console.log("prisma.user.create calls:", (prisma.user.create as jest.Mock).mock.calls);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        walletAddress: 'stake1ux2rrlvgt6rzfzzk9rffppz6hk7h7x59yjjxcdplehpzxecvt3hqw',
        walletAddressVerified: expect.any(Date),
      }),
    });
    console.log("All expectations passed");
  });

  it('should handle invalid network configuration', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        walletNetwork: 2, // Invalid network
        stakeAddress: 'stake_test1uqrw9tjymlm8wrwq7jk68n6v7fs9qz8z0tkdkve26dylmfc2ux2hj',
        signature: 'mock_signature',
        key: 'mock_key',
        nonce: 'mock_nonce',
      }),
    };

    const response = await POST(mockRequest as unknown as Request);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody).toEqual({ error: "Invalid network configuration" });
  });

  it('should handle existing user error', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        email: 'existing@example.com',
        password: 'password123',
      }),
    };

    (signupUser as jest.Mock).mockResolvedValue({
      success: true,
      email: 'existing@example.com',
      passwordHash: 'hashedpassword',
    });

    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: 1, email: 'existing@example.com' });

    const response = await POST(mockRequest as unknown as Request);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody).toEqual({ error: 'existingUser' });
  });

  it('should handle signup failure', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        email: 'test@example.com',
        password: 'password123',
      }),
    };

    (signupUser as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Signup failed',
    });

    const response = await POST(mockRequest as unknown as Request);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody).toEqual({ error: 'Signup failed' });
  });
});
