/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PortfolioService } from '../portfolio/portfolio.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private portfolioService: PortfolioService,
  ) {}

  async signup(email: string, password: string, nombre?: string, isDemoAccount: boolean = false) {
    // Check if user already exists
    const existingUser = await this.usersService.findUserByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create the user
    const user = await this.usersService.createUser(email, passwordHash, nombre, isDemoAccount);

    // Create a portfolio for the new user with $1,000 starting balance
    await this.portfolioService.createPortfolio(user.id, 1000);

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        isDemoAccount: user.isDemoAccount,
      },
    };
  }

  async login(email: string, password: string) {
    // Find user by email
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password); // Changed from passwordHash
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        isDemoAccount: user.isDemoAccount,
      },
    };
  }

  async validateUser(userId: string) {
    return await this.usersService.findUserById(userId);
  }

  async syncAuth0User(userData: {
    email: string;
    name: string;
    picture?: string;
    auth0Id: string;
  }) {
    let user = await this.usersService.findByAuth0Id(userData.auth0Id);

    if (!user) {
      user = await this.usersService.findByEmail(userData.email);

      if (user) {
        // Link existing user with Auth0
        user = await this.usersService.update(user.id, {
          auth0Id: userData.auth0Id,
          picture: userData.picture,
        });
      } else {
        // Create new user
        const randomPassword = await bcrypt.hash(
          crypto.randomUUID(),
          10,
        );
        user = await this.usersService.create({
          email: userData.email,
          name: userData.name,
          nombre: userData.name,
          password: randomPassword,
          picture: userData.picture,
          auth0Id: userData.auth0Id,
        });
      }
    }

    return user;
  }
}
