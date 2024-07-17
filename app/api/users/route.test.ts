import { GET, POST, DELETE } from './route';
import prisma from "@/app/lib/prisma";
import { cookies } from 'next/headers';

jest.mock("@/app/lib/prisma", () => ({
    user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    asset: {
        deleteMany: jest.fn(),
    },
}));

jest.mock('next/headers', () => ({
    cookies: jest.fn(),
}));

describe('User Management API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (cookies as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue('valid-auth-token'),
        });
    });

    describe('GET /api/users', () => {
        it('should return all users when users exist', async () => {
            const mockUsers = [
                { id: '1', name: 'User 1', verifiedPolicy: null },
                { id: '2', name: 'User 2', verifiedPolicy: 'admin' },
            ];
            (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

            const response = await GET({} as Request);
            const responseBody = await response.json();

            expect(response.status).toBe(200);
            expect(responseBody).toEqual(mockUsers);
        });

        it('should return 404 when no users found', async () => {
            (prisma.user.findMany as jest.Mock).mockResolvedValue(null);

            const response = await GET({} as Request);
            const responseBody = await response.json();

            expect(response.status).toBe(404);
            expect(responseBody).toEqual({ error: "No users found" });
        });
    });

    describe('POST /api/users', () => {
        it('should update user to admin when not admin', async () => {
            const mockRequest = {
                json: jest.fn().mockResolvedValue({ id: '1' }),
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', verifiedPolicy: null });
            (prisma.user.update as jest.Mock).mockResolvedValue({ id: '1', verifiedPolicy: 'admin' });

            const response = await POST(mockRequest as unknown as Request);
            const responseBody = await response.json();

            expect(response.status).toBe(200);
            expect(responseBody).toEqual({ id: '1', verifiedPolicy: 'admin' });
        });

        it('should remove admin status when user is admin', async () => {
            const mockRequest = {
                json: jest.fn().mockResolvedValue({ id: '1' }),
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', verifiedPolicy: 'admin' });
            (prisma.user.update as jest.Mock).mockResolvedValue({ id: '1', verifiedPolicy: null });

            const response = await POST(mockRequest as unknown as Request);
            const responseBody = await response.json();

            expect(response.status).toBe(200);
            expect(responseBody).toEqual({ id: '1', verifiedPolicy: null });
        });

        it('should return 404 when user not found', async () => {
            const mockRequest = {
                json: jest.fn().mockResolvedValue({ id: '1' }),
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            const response = await POST(mockRequest as unknown as Request);
            const responseBody = await response.json();

            expect(response.status).toBe(404);
            expect(responseBody).toEqual({ error: "User not found" });
        });

        it('should return 500 when update fails', async () => {
            const mockRequest = {
                json: jest.fn().mockResolvedValue({ id: '1' }),
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', verifiedPolicy: null });
            (prisma.user.update as jest.Mock).mockRejectedValue(new Error('Update failed'));

            const response = await POST(mockRequest as unknown as Request);
            const responseBody = await response.json();

            expect(response.status).toBe(500);
            expect(responseBody).toEqual({ error: "Failed to update user" });
        });
    });

    describe('DELETE /api/users', () => {
        it('should delete user and their assets', async () => {
            const mockRequest = {
                json: jest.fn().mockResolvedValue({ id: '1' }),
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
            (prisma.asset.deleteMany as jest.Mock).mockResolvedValue({ count: 2 });
            (prisma.user.delete as jest.Mock).mockResolvedValue({ id: '1', name: 'Deleted User' });

            const response = await DELETE(mockRequest as unknown as Request);
            const responseBody = await response.json();

            expect(response.status).toBe(200);
            expect(responseBody).toEqual({ id: '1', name: 'Deleted User' });
            expect(prisma.asset.deleteMany).toHaveBeenCalledWith({ where: { UserId: '1' } });
            expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: '1' } });
        });

        it('should return 400 when user ID is not provided', async () => {
            const mockRequest = {
                json: jest.fn().mockResolvedValue({}),
            };

            const response = await DELETE(mockRequest as unknown as Request);
            const responseBody = await response.json();

            expect(response.status).toBe(400);
            expect(responseBody).toEqual({ error: "User ID is required" });
        });

        it('should return 404 when user not found', async () => {
            const mockRequest = {
                json: jest.fn().mockResolvedValue({ id: '1' }),
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            const response = await DELETE(mockRequest as unknown as Request);
            const responseBody = await response.json();

            expect(response.status).toBe(404);
            expect(responseBody).toEqual({ error: "User not found" });
        });

        it('should return 500 when delete operation fails', async () => {
            const mockRequest = {
                json: jest.fn().mockResolvedValue({ id: '1' }),
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
            (prisma.asset.deleteMany as jest.Mock).mockRejectedValue(new Error('Delete failed'));

            const response = await DELETE(mockRequest as unknown as Request);
            const responseBody = await response.json();

            expect(response.status).toBe(500);
            expect(responseBody).toEqual({ error: "Failed to delete user and assets" });
        });
    });
});

describe('Cookie-blocked scenarios', () => {
    beforeEach(() => {
        (cookies as jest.Mock).mockImplementation(() => {
            throw new Error('Cookies are not available');
        });
    });

    it('should handle GET request when cookies are blocked', async () => {
        const response = await GET({} as Request);
        const responseBody = await response.json();

        expect(response.status).toBe(401);
        expect(responseBody).toEqual({ error: "Authentication failed" });
    });

    it('should handle POST request when cookies are blocked', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({ id: '1' }),
        };

        const response = await POST(mockRequest as unknown as Request);
        const responseBody = await response.json();

        expect(response.status).toBe(401);
        expect(responseBody).toEqual({ error: "Authentication failed" });
    });

    it('should handle DELETE request when cookies are blocked', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({ id: '1' }),
        };

        const response = await DELETE(mockRequest as unknown as Request);
        const responseBody = await response.json();

        expect(response.status).toBe(401);
        expect(responseBody).toEqual({ error: "Authentication failed" });
    });
});