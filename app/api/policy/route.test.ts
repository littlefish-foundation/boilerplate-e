import { GET, POST } from './route';
import prisma from "@/app/lib/prisma";

jest.mock("@/app/lib/prisma", () => ({
  policy: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Policy API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/policy', () => {
    it('should return all policies when policies exist', async () => {
      const mockPolicies = [
        { id: '1', policyID: 'a'.repeat(56) },
        { id: '2', policyID: 'b'.repeat(56) },
      ];
      (prisma.policy.findMany as jest.Mock).mockResolvedValue(mockPolicies);

      const response = await GET({} as Request);
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody).toEqual(mockPolicies);
    });

    it('should return an empty array when no policies found', async () => {
      (prisma.policy.findMany as jest.Mock).mockResolvedValue([]);

      const response = await GET({} as Request);
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody).toEqual([]);
    });

    it('should return 404 when prisma.policy.findMany returns null', async () => {
      (prisma.policy.findMany as jest.Mock).mockResolvedValue(null);

      const response = await GET({} as Request);
      const responseBody = await response.json();

      expect(response.status).toBe(404);
      expect(responseBody).toEqual({ error: "No policies found" });
    });
  });

  describe('POST /api/policy', () => {
    it('should create a new policy when valid policyID is provided', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ policyID: 'a'.repeat(56) }),
      };

      (prisma.policy.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.policy.create as jest.Mock).mockResolvedValue({ id: '1', policyID: 'a'.repeat(56) });

      const response = await POST(mockRequest as unknown as Request);
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody).toEqual({ success: true });
      expect(prisma.policy.create).toHaveBeenCalledWith({
        data: { policyID: 'a'.repeat(56) },
      });
    });

    it('should return 400 when policyID is invalid (not 56 characters)', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ policyID: 'a'.repeat(55) }), // 55 characters
      };

      const response = await POST(mockRequest as unknown as Request);
      const responseBody = await response.json();

      expect(response.status).toBe(400);
      expect(responseBody).toEqual({ error: "Invalid policy ID" });
      expect(prisma.policy.create).not.toHaveBeenCalled();
    });

    it('should return 400 when policy already exists', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ policyID: 'a'.repeat(56) }),
      };

      (prisma.policy.findUnique as jest.Mock).mockResolvedValue({ id: '1', policyID: 'a'.repeat(56) });

      const response = await POST(mockRequest as unknown as Request);
      const responseBody = await response.json();

      expect(response.status).toBe(400);
      expect(responseBody).toEqual({ error: "Policy already exists" });
      expect(prisma.policy.create).not.toHaveBeenCalled();
    });
  });
});