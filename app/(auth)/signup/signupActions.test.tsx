import { generateNonce, signupWithMail, signupWithAsset, signupWithCardano } from './signupActions';
import { validateEmail, validatePassword } from "littlefish-nft-auth-framework/backend";

jest.mock("littlefish-nft-auth-framework/backend", () => ({
  validateEmail: jest.fn(),
  validatePassword: jest.fn(),
}));

// Mock global fetch
global.fetch = jest.fn();

describe('Signup Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ROOT_URL = 'http://localhost:3000';
  });

  describe('generateNonce', () => {
    it('should generate a 32-character hex string', async () => {
      const nonce = await generateNonce();
      expect(nonce).toMatch(/^[0-9a-f]{32}$/);
    });
  });

  describe('signupWithMail', () => {
    it('should return success for valid email and password', async () => {
      (validateEmail as jest.Mock).mockReturnValue(true);
      (validatePassword as jest.Mock).mockReturnValue(true);
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const result = await signupWithMail('test@example.com', 'validPassword123');
      expect(result).toEqual({ success: true });
    });

    it('should return error for invalid email', async () => {
      (validateEmail as jest.Mock).mockReturnValue(false);

      const result = await signupWithMail('invalidemail', 'validPassword123');
      expect(result).toEqual({ error: 'Invalid Email format' });
    });

    it('should return error for weak password', async () => {
      (validateEmail as jest.Mock).mockReturnValue(true);
      (validatePassword as jest.Mock).mockReturnValue(false);

      const result = await signupWithMail('test@example.com', 'weak');
      expect(result).toEqual({ error: 'Password weak' });
    });

    it('should handle existing user error', async () => {
      (validateEmail as jest.Mock).mockReturnValue(true);
      (validatePassword as jest.Mock).mockReturnValue(true);
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve('existingUser'),
      });

      const result = await signupWithMail('existing@example.com', 'validPassword123');
      expect(result).toEqual({ error: 'User already exists' });
    });
  });

  describe('signupWithAsset', () => {
    it('should return success for valid asset signup', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const result = await signupWithAsset(
        'stake_test1uqrw9tjymlm8wrwq7jk68n6v7fs9qz8z0tkdkve26dylmfc2ux2hj',
        0,
        'mockKey',
        'mockSignature',
        { policyID: 'mockPolicy', assetName: 'mockAsset', amount: 1 }
      );
      expect(result).toEqual({ success: true });
    });

    it('should handle existing user error', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve('existingUser'),
      });

      const result = await signupWithAsset(
        'stake_test1uqrw9tjymlm8wrwq7jk68n6v7fs9qz8z0tkdkve26dylmfc2ux2hj',
        0,
        'mockKey',
        'mockSignature',
        { policyID: 'mockPolicy', assetName: 'mockAsset', amount: 1 }
      );
      expect(result).toEqual({ error: 'User already exists' });
    });
  });

  describe('signupWithCardano', () => {
    it('should return success for valid Cardano signup', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const result = await signupWithCardano(
        'stake_test1uqrw9tjymlm8wrwq7jk68n6v7fs9qz8z0tkdkve26dylmfc2ux2hj',
        0,
        'mockKey',
        'mockSignature'
      );
      expect(result).toEqual({ success: true });
    });

    it('should handle existing user error', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve('existingUser'),
      });

      const result = await signupWithCardano(
        'stake_test1uqrw9tjymlm8wrwq7jk68n6v7fs9qz8z0tkdkve26dylmfc2ux2hj',
        0,
        'mockKey',
        'mockSignature'
      );
      expect(result).toEqual({ error: 'User already exists' });
    });
  });
});