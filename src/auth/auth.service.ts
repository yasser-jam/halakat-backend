import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma.service'; // Assume you have a Prisma service

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(phone_number: string, pass: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { mobile_phone_number: phone_number },
    });
    // if (teacher && (await bcrypt.compare(pass, teacher.password))) {
    if (teacher) {
      const { ...result } = teacher;
      return result;
    }
    return null;
  }

  async validateStudent(phone_number: string, pass: string) {
    console.log(phone_number);
    const student = await this.prisma.student.findUnique({
      where: { student_mobile: phone_number },
    });

    // if (teacher && (await bcrypt.compare(pass, teacher.password))) {
    if (student) {
      const { ...result } = student;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      mobile_phone_number: user.mobile_phone_number,
      sub: user.id,
      role: user.role,
      userType: 'TEACHER',
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async studentLogin(user: any) {
    const payload = {
      mobile_phone_number: user.mobile_phone_number,
      sub: user.id,
      role: user.role,
      userType: 'STUDENT',
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.teacher.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }
}
