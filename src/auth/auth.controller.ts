import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto, RegisterDto } from 'src/dto/teacher.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { TeacherService } from './../teacher/teacher.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private teacherService: TeacherService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(
      body.mobile_phone_number,
      body.password,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user);
  }

  @Post('admin/login')
  async adminLogin(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(
      body.mobile_phone_number,
      body.password,
    );
    if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role))
      throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('mobile/profile')
  @ApiParam({
    name: 'campaign id',
    type: 'number',
  })
  getMobileProfile(@Request() req) {
    const user = req.user;

    if (!user) throw new UnauthorizedException('Not Found');

    // get teacher info
    const teacher = this.teacherService.findInfo({
      id: user.id,
      campaign_id: 1,
    });
    return teacher;
  }
}
