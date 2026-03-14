import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Get current user's profile with demo status
   */
  @Get('profile')
  @ApiOperation({ 
    summary: 'Get user profile',
    description: 'Retrieve detailed user profile including demo account status',
  })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@Request() req) {
    const user = await this.usersService.findUserById(req.user.userId);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      isDemoAccount: user.isDemoAccount,
      tradeCount: user.tradeCount,
      createdAt: user.createdAt,
    };
  }

  /**
   * Toggle demo mode for current user
   */
  @Post('toggle-demo')
  @ApiOperation({ 
    summary: 'Toggle demo/live mode',
    description: 'Switch between demo account (practice) and live account (real trading)',
  })
  @ApiResponse({ status: 200, description: 'Demo mode toggled successfully' })
  async toggleDemoMode(@Request() req, @Body() body: { isDemoAccount: boolean }) {
    const updatedUser = await this.usersService.toggleDemoMode(req.user.userId, body.isDemoAccount);
    return {
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        nombre: updatedUser.nombre,
        isDemoAccount: updatedUser.isDemoAccount,
      },
    };
  }
}
