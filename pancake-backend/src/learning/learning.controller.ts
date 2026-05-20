import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LearningService } from './learning.service';

@Controller('learning')
export class LearningController {
  constructor(private svc: LearningService) {}

  @Get('progress/:userId')
  async getProgress(@Param('userId') userId: string) {
    return this.svc.getProgressForUser(userId);
  }

  @Post('progress')
  async saveProgress(
    @Body() body: { userId?: string; userEmail?: string; lessonSlug: string; progress: number; completed: boolean },
  ) {
    let { userId, userEmail, lessonSlug, progress, completed } = body;
    if (!userId && userEmail) {
      userId = await this.svc.resolveUserIdByEmail(userEmail);
      if (!userId) {
        return { error: 'User not found' };
      }
    }
    if (!userId) return { error: 'Missing userId or userEmail' };
    return this.svc.upsertProgress(userId, lessonSlug, progress, completed);
  }
}
