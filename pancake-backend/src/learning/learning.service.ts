import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LearningService {
  constructor(private prisma: PrismaService) {}

  async getProgressForUser(userId: string) {
    return (this.prisma as any).lessonProgress.findMany({ where: { userId } });
  }

  async resolveUserIdByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user?.id;
  }

  async upsertProgress(userId: string, lessonSlug: string, progress: number, completed: boolean) {
    return (this.prisma as any).lessonProgress.upsert({
      where: { userId_lessonSlug: { userId, lessonSlug } },
      create: { userId, lessonSlug, progress, completed },
      update: { progress, completed },
    });
  }
}
