/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAllUsers(): Promise<User[]> {
    console.log('Usando el asistente para buscar todos los usuarios...');
    const users = await this.prisma.user.findMany();
    console.log('Usuarios encontrados:', users);
    return users;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    console.log(`Buscando usuario con email: ${email}`);
    const user = await this.prisma.user.findUnique({ where: { email } });
    console.log('Usuario encontrado:', user);
    return user;
  }

  async findUserById(id: string): Promise<User | null> {
    console.log(`Buscando usuario con id: ${id}`);
    const user = await this.prisma.user.findUnique({ where: { id } });
    console.log('Usuario encontrado:', user);
    return user;
  }

  async createUser(email: string, passwordHash: string, nombre: string = '', isDemoAccount: boolean = false): Promise<User> {
    const savedUser = await this.prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name: nombre,
        nombre,
        isDemoAccount,
      },
    });
    return savedUser;
  }

  async toggleDemoMode(userId: string, isDemoAccount: boolean): Promise<User> {
    console.log(`Toggling demo mode for user ${userId} to ${isDemoAccount}`);
    const user = await this.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return await this.prisma.user.update({
      where: { id: userId },
      data: { isDemoAccount },
    });
  }

  async findByAuth0Id(auth0Id: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { auth0Id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    return this.prisma.user.create({
      data: userData as any,
    });
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    return this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  async findOneByAuth0Id(auth0Id: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { auth0Id } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}