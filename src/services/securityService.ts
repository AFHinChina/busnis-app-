import { hash, compare } from 'bcrypt';
import { generateToken, verifyToken } from '../utils/jwt';
import { TwoFactorAuth } from '../utils/2fa';

export class SecurityService {
  static async setupTwoFactor(userId: string): Promise<{ secret: string; qrCode: string }> {
    const twoFactor = new TwoFactorAuth();
    const secret = twoFactor.generateSecret();
    const qrCode = twoFactor.generateQRCode(secret);
    
    await dbOperations.updateUser(userId, { twoFactorSecret: secret });
    
    return { secret, qrCode };
  }

  static async verifyTwoFactor(userId: string, token: string): Promise<boolean> {
    const user = await dbOperations.getUser(userId);
    const twoFactor = new TwoFactorAuth();
    
    return twoFactor.verifyToken(user.twoFactorSecret, token);
  }

  static detectFraud(transaction: Transaction): {
    isSuspicious: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    reasons: string[];
  } {
    const reasons: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // Implement fraud detection logic
    // Example: Check for unusual amounts, locations, or patterns
    
    return {
      isSuspicious: reasons.length > 0,
      riskLevel,
      reasons,
    };
  }
}