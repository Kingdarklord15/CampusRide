import bcrypt from "bcrypt";
import { env } from "../../config/env.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../config/jwt.js";
import { badRequest, unauthorized } from "../../utils/errors.js";
import type { AuthRepository } from "./auth.repository.js";
import type { LoginInput, RegisterInput, TokenPair } from "./auth.types.js";

export class AuthService {
  constructor(private readonly repo: AuthRepository) { }

  async register(input: RegisterInput) {
    const existing = await this.repo.findByEmail(input.email);
    if (existing) throw badRequest("Email is already registered");

    const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);
    const user = await this.repo.createUser({
      name: input.name,
      email: input.email,
      phone: input.phone,
      role: input.role,
      passwordHash
    });
    const tokens = await this.issueTokens(user.id, user.role);
    return { user: this.sanitize(user), ...tokens };
  }

  async login(input: LoginInput) {
    const user = await this.repo.findByEmail(input.email);
    if (!user || !user.isActive) throw unauthorized("Invalid credentials");

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) throw unauthorized("Invalid credentials");

    await this.repo.touchLogin(user.id);
    const tokens = await this.issueTokens(user.id, user.role);
    return { user: this.sanitize(user), ...tokens };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const payload = verifyRefreshToken(refreshToken);
    const user = await this.repo.findById(payload.sub);
    if (!user || !user.refreshTokenHash || !user.isActive) throw unauthorized("Invalid refresh token");

    const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!valid) throw unauthorized("Invalid refresh token");

    return this.issueTokens(user.id, user.role);
  }

  async logout(userId: string) {
    await this.repo.updateRefreshTokenHash(userId, null);
  }

  async me(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) throw unauthorized();
    return this.sanitize(user);
  }

  private async issueTokens(userId: string, role: string) {
    const accessToken = signAccessToken({ sub: userId, role });
    const refreshToken = signRefreshToken({ sub: userId, role });
    const refreshTokenHash = await bcrypt.hash(refreshToken, env.BCRYPT_SALT_ROUNDS);
    await this.repo.updateRefreshTokenHash(userId, refreshTokenHash);
    return { accessToken, refreshToken };
  }

  private sanitize<T extends { passwordHash?: string; refreshTokenHash?: string | null }>(user: T) {
    const { passwordHash: _passwordHash, refreshTokenHash: _refreshTokenHash, ...safe } = user;
    return safe;
  }
}
