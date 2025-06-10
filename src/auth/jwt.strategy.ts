import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your_jwt_secret', // Use an environment variable in production
    });
  }

  async validate(payload: any) {
    const { sub, userType } = payload;

    if (userType === 'TEACHER') {
      const user = await this.prisma.teacher.findUnique({ where: { id: sub } });
      if (!user) throw new UnauthorizedException();
      return { ...user, userType };
    }

    if (userType === 'STUDENT') {
      const user = await this.prisma.student.findUnique({ where: { id: sub } });
      if (!user) throw new UnauthorizedException();
      return { ...user, userType };
    }

    throw new UnauthorizedException('Invalid user type');
  }
}
