import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { User } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async findOne(id: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        birthDate: true,
        country: true,
        language: true,
        theme: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        favorites: {
          include: {
            anime: {
              include: {
                genres: true,
              },
            },
          },
        },
        watchHistory: {
          include: {
            anime: true,
          },
          orderBy: {
            updatedAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Remove password from response
    const { ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    await this.authService.checkUserExists({
      email: updateProfileDto.email,
      username: updateProfileDto.username,
      userIdToExclude: id,
    });

    const updateData: any = { ...updateProfileDto };

    // Convert birthDate string to Date if provided
    if (updateProfileDto.birthDate) {
      updateData.birthDate = new Date(updateProfileDto.birthDate);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        birthDate: true,
        country: true,
        language: true,
        theme: true,
        role: true,
        emailVerified: true,
        updatedAt: true,
      },
    });
  }

  async getWatchHistory(userId: string) {
    const history = await this.prisma.watchHistory.findMany({
      where: { userId },
      include: {
        anime: {
          include: {
            genres: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 50,
    });

    return {
      items: history.map(h => ({
        ...h.anime,
        watchProgress: {
          episode: h.episode,
          progress: h.progress,
          updatedAt: h.updatedAt,
        },
      })),
      total: history.length,
      hasNextPage: false,
    };
  }

  async getStats(userId: string) {
    const [favoritesCount, historyCount, totalWatchTime] = await Promise.all([
      this.prisma.favorite.count({ where: { userId } }),
      this.prisma.watchHistory.count({ where: { userId } }),
      this.prisma.watchHistory.aggregate({
        where: { userId },
        _sum: { progress: true },
      }),
    ]);

    return {
      favoritesCount,
      historyCount,
      totalWatchTime: Math.round((totalWatchTime._sum.progress || 0) / 60), // Convert to minutes
    };
  }
}
