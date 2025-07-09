import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginAdminDto,
  LoginTeacherDto,
  LoginStudentDto,
} from './../dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
// import { PrismaService } from '../prisma.service'; // Remove this line

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    // private prisma: PrismaService, // Remove this line
  ) {}

  @Post('login/admin')
  @ApiOperation({ summary: 'Login as Admin' })
  loginAdmin(@Body() dto: LoginAdminDto) {
    return this.authService.loginAdmin(dto);
  }

  @Post('login/teacher')
  @ApiOperation({ summary: 'Login as Teacher' })
  loginTeacher(@Body() dto: LoginTeacherDto) {
    return this.authService.loginTeacher(dto);
  }

  @Post('login/student')
  @ApiOperation({ summary: 'Login as Student' })
  loginStudent(@Body() dto: LoginStudentDto) {
    return this.authService.loginStudent(dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  @ApiOperation({ summary: 'Get user profile (plain teacher info only)' })
  async getProfile(@Request() req) {
    const user = req.user;
    if (!user || user.userType !== 'TEACHER') {
      return { teacher: null };
    }
    // Fetch only the teacher info, no roles/permissions
    const teacher = await this.authService.getTeacherPlainInfo(user.id);
    return { teacher };
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('my-permissions')
  @ApiOperation({
    summary: 'Get teacher roles and permissions for a specific campaign',
  })
  @ApiHeader({
    name: 'campaign_id',
    description: 'Campaign ID to filter permissions',
    required: true,
  })
  async getMyPermissions(@Request() req) {
    const user = req.user;
    const campaignId = req.headers['campaign_id'] || req.headers['campaign-id'];
    if (!user || user.userType !== 'TEACHER' || !campaignId) {
      return { roles: [], permissions: [] };
    }
    return this.authService.getTeacherPermissionsForCampaign(
      user.id,
      Number(campaignId),
    );
  }
}
