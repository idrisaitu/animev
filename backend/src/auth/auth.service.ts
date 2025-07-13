import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        isActive: true,
        password: true,
      }
    });

    if (!user) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Аккаунт заблокирован');
    }

    if (await bcrypt.compare(password, user.password)) {
      // Update last login time
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<any> {
    await this.checkUserExists({
      email: registerDto.email,
      username: registerDto.username,
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        username: registerDto.username,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        country: registerDto.country,
        birthDate: registerDto.birthDate ? new Date(registerDto.birthDate) : null,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        createdAt: true,
      }
    });

    return this.login(user);
  }

  async checkUserExists(params: {
    email?: string;
    username?: string;
    userIdToExclude?: string;
  }): Promise<void> {
    const { email, username, userIdToExclude } = params;
    if (!email && !username) {
      return;
    }

    const orConditions = [];
    if (email) orConditions.push({ email });
    if (username) orConditions.push({ username });

    const where: any = { OR: orConditions };
    if (userIdToExclude) {
      where.id = { not: userIdToExclude };
    }

    const existingUser = await this.prisma.user.findFirst({ where });

    if (existingUser) {
      if (email && existingUser.email === email) {
        throw new ConflictException('Пользователь с таким email уже существует');
      }
      if (username && existingUser.username === username) {
        throw new ConflictException('Пользователь с таким именем уже существует');
      }
    }
  }

  async generatePasswordResetToken(email: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const payload = { email: user.email, sub: user.id, type: 'password_reset' };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.type !== 'password_reset') {
        throw new UnauthorizedException('Invalid token type');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { email: payload.email },
        data: { password: hashedPassword },
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
} 