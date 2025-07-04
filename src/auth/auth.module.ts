// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { AuthService } from './auth.service';
// import { JwtStrategy } from './jwt.strategy';
// import { PrismaService } from '../prisma.service';

// @Module({
//   imports: [
//     PassportModule,
//     JwtModule.register({
//       secret: 'your_jwt_secret', // Use an environment variable in production
//       signOptions: { expiresIn: '1h' },
//     }),
//   ],
//   providers: [AuthService, JwtStrategy, PrismaService],
//   exports: [AuthService],
// })
// export class AuthModule {}
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key', // use .env
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
