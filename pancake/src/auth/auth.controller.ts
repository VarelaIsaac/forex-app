import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'Create a new user account with email and password. Optionally set as demo account for practice trading.',
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered. Returns JWT token and user info.',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          email: 'trader@example.com',
          nombre: 'John Trader',
          isDemoAccount: false,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'User with this email already exists' })
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(
      signupDto.email,
      signupDto.password,
      signupDto.nombre,
      signupDto.isDemoAccount,
    );
  }

  @Post('login')
  @ApiOperation({ 
    summary: 'Login with existing account',
    description: 'Authenticate with email and password. Returns JWT token for subsequent requests.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful. Returns JWT token and user info.',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('sync')
  async syncAuth0User(@Body() userData: {
    email: string;
    name: string;
    picture?: string;
    auth0Id: string;
  }) {
    return this.authService.syncAuth0User(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Request() req) {
    return req.user;
  }
}
