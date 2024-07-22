import { GET, POST } from './route';
import prisma from "@/app/lib/prisma";

jest.mock("@/app/lib/prisma", () => ({
  settings: {
    findFirst: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Settings API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/settings', () => {
    it('should return strictPolicy when settings exist', async () => {
      (prisma.settings.findFirst as jest.Mock).mockResolvedValue({
        id: '1',
        strictPolicy: true,
      });

      const response = await GET({} as Request);
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody).toBe(true);
    });

    it('should return 404 when no settings found', async () => {
      (prisma.settings.findFirst as jest.Mock).mockResolvedValue(null);

      const response = await GET({} as Request);
      const responseBody = await response.json();

      expect(response.status).toBe(404);
      expect(responseBody).toEqual({ error: "No settings found" });
    });
  });

  describe('POST /api/settings', () => {
    it('should update existing settings', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ strictPolicy: true }),
      };

      (prisma.settings.findFirst as jest.Mock).mockResolvedValue({
        id: '1',
        strictPolicy: false,
      });

      (prisma.settings.update as jest.Mock).mockResolvedValue({
        id: '1',
        strictPolicy: true,
      });

      const response = await POST(mockRequest as unknown as Request);
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody).toEqual({ success: true });
      expect(prisma.settings.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { strictPolicy: true },
      });
    });

    it('should create new settings if none exist', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ strictPolicy: true }),
      };

      (prisma.settings.findFirst as jest.Mock).mockResolvedValue(null);

      (prisma.settings.create as jest.Mock).mockResolvedValue({
        id: '1',
        strictPolicy: true,
      });

      const response = await POST(mockRequest as unknown as Request);
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody).toEqual({ success: true });
      expect(prisma.settings.create).toHaveBeenCalledWith({
        data: { strictPolicy: true },
      });
    });

    it('should return 400 if no change is needed', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ strictPolicy: true }),
      };

      (prisma.settings.findFirst as jest.Mock).mockResolvedValue({
        id: '1',
        strictPolicy: true,
      });

      const response = await POST(mockRequest as unknown as Request);
      const responseBody = await response.json();

      expect(response.status).toBe(400);
      expect(responseBody).toEqual({ error: "No change needed" });
      expect(prisma.settings.update).not.toHaveBeenCalled();
      expect(prisma.settings.create).not.toHaveBeenCalled();
    });
  });
});