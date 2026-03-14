import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSessionDto } from './dto';

@ApiTags('Sessions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Get()
  @ApiOperation({
    summary: 'List all sessions',
    description: 'Retrieve every trading session for the authenticated user including wallet balances and trades.',
  })
  @ApiResponse({ status: 200, description: 'Sessions returned successfully' })
  async getSessions(@Request() req) {
    return await this.sessionsService.getSessions(req.user.userId);
  }

  @Get('active')
  @ApiOperation({
    summary: 'Get active sessions',
    description: 'Retrieve only currently active sessions with available balances.',
  })
  @ApiResponse({ status: 200, description: 'Active sessions returned successfully' })
  async getActiveSessions(@Request() req) {
    return await this.sessionsService.getActiveSessions(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get session details',
    description: 'Fetch a single session including its trade history and wallet details.',
  })
  @ApiParam({ name: 'id', example: 12, description: 'Session identifier' })
  @ApiResponse({ status: 200, description: 'Session returned successfully' })
  async getSessionById(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return await this.sessionsService.getSessionById(req.user.userId, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Start a new session',
    description: 'Allocate funds from the main portfolio into a brand-new trading session wallet.',
  })
  @ApiResponse({ status: 201, description: 'Session created successfully' })
  async createSession(@Request() req, @Body() dto: CreateSessionDto) {
    return await this.sessionsService.createSession(req.user.userId, dto);
  }

  @Post(':id/end')
  @ApiOperation({
    summary: 'Close a session and release funds',
    description: 'Return the remaining session balance to the primary portfolio and mark the session as closed.',
  })
  @ApiParam({ name: 'id', example: 7, description: 'Session identifier' })
  @ApiResponse({ status: 200, description: 'Session closed successfully' })
  async endSession(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return await this.sessionsService.endSession(req.user.userId, id);
  }
}
