// import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcryptjs';
// import { PrismaService } from '../prisma.service'; // Assume you have a Prisma service
// import { LogService } from 'src/log/log.service';
// import { LogEvent } from '@prisma/client';

// @Injectable()
// export class AuthService {
//   constructor(
//     private jwtService: JwtService,
//     private prisma: PrismaService,
//   ) {}

//   async validateUser(phone_number: string, pass: string) {
//     const teacher = await this.prisma.teacher.findUnique({
//       where: { mobile_phone_number: phone_number },
//     });
//     // if (teacher && (await bcrypt.compare(pass, teacher.password))) {
//     if (teacher) {
//       const { ...result } = teacher;

//       // log the operation
//       // ✅ Log the login event
//       // await this.logService.createLog({
//       //   event: LogEvent.TEACHER_LOGIN,
//       //   teacherId: teacher.id,
//       //   metadata: JSON.stringify({
//       //     mobile: teacher.mobile_phone_number,
//       //     role: teacher.role,
//       //   }),
//       // });

//       return result;
//     }
//     return null;
//   }

//   async validateStudent(phone_number: string, pass: string) {
//     const student = await this.prisma.student.findUnique({
//       where: { student_mobile: phone_number },
//     });

//     // if (teacher && (await bcrypt.compare(pass, teacher.password))) {
//     if (student) {
//       const { ...result } = student;
//       return result;
//     }
//     return null;
//   }

//   async login(user: any) {
//     const payload = {
//       mobile_phone_number: user.mobile_phone_number,
//       sub: user.id,
//       role: user.role,
//       userType: 'TEACHER',
//     };
//     return {
//       access_token: this.jwtService.sign(payload),
//     };
//   }

//   async studentLogin(user: any) {
//     const payload = {
//       mobile_phone_number: user.mobile_phone_number,
//       sub: user.id,
//       role: user.role,
//       userType: 'STUDENT',
//     };
//     return {
//       access_token: this.jwtService.sign(payload),
//     };
//   }

//   async register(data: any) {
//     const hashedPassword = await bcrypt.hash(data.password, 10);
//     return this.prisma.teacher.create({
//       data: {
//         ...data,
//         password: hashedPassword,
//       },
//     });
//   }
// }

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async loginAdmin({ mobile_phone_number }) {
    const user = await this.prisma.teacher.findUnique({
      where: { mobile_phone_number },
    });
    if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      userType: 'ADMIN',
      role: user.role,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async loginTeacher({ mobile_phone_number }) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { mobile_phone_number },
      include: {
        campaign_assignments: {
          where: { is_active: true },
          include: {
            campaign: {
              include: {
                mosque: {
                  include: {
                    organization: true,
                  },
                },
              },
            },
          },
          take: 1,
          orderBy: { assigned_date: 'desc' },
        },
      },
    });
    if (!teacher) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: teacher.id,
      userType: 'TEACHER',
    };

    // Remove sensitive fields and relations from teacher info
    const teacherInfo = { ...teacher };
    delete teacherInfo.password;
    delete teacherInfo.campaign_assignments;

    const response: any = {
      access_token: this.jwtService.sign(payload),
      teacher: teacherInfo,
    };

    // If role is ORGANIZATION_ADMIN, return assigned_org
    if (teacher.role === 'ORGANIZATION_ADMIN') {
      const campaignAssignment = teacher.campaign_assignments[0];
      if (campaignAssignment?.campaign?.mosque?.organization) {
        response.assigned_org = campaignAssignment.campaign.mosque.organization;
      }
    }

    // If role is MOSQUE_ADMIN, return assigned_mosque
    if (teacher.role === 'MOSQUE_ADMIN') {
      const campaignAssignment = teacher.campaign_assignments[0];
      if (campaignAssignment?.campaign?.mosque) {
        response.assigned_mosque = campaignAssignment.campaign.mosque;
      }
    }

    return response;
  }

  async loginStudent({ student_mobile, password }) {
    const student = await this.prisma.student.findUnique({
      where: { student_mobile },
    });
    if (!student || !(await bcrypt.compare(password, student.password))) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: student.id,
      userType: 'STUDENT',
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async getTeacherProfile(userId: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: userId },
      include: {
        teacher_roles: {
          include: {
            role: true,
          },
        },
      },
    });
    if (!teacher) return { roles: [], permissions: [], teacher: null };
    const roles = teacher.teacher_roles.map((tr) => tr.role.name);
    const permissions = Array.from(
      new Set(
        teacher.teacher_roles.flatMap((tr) =>
          Array.isArray(tr.role.permissions)
            ? tr.role.permissions
            : typeof tr.role.permissions === 'string'
              ? JSON.parse(tr.role.permissions)
              : [],
        ),
      ),
    );
    // Remove sensitive fields from teacher info
    const teacherInfo = { ...teacher };
    delete teacherInfo.password;
    return { roles, permissions, teacher: teacherInfo };
  }

  async getTeacherPlainInfo(userId: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: userId },
    });
    if (!teacher) return null;
    const teacherInfo = { ...teacher };
    delete teacherInfo.password;
    return teacherInfo;
  }

  async getTeacherPermissionsForCampaign(userId: number, campaignId: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: userId },
      include: {
        teacher_roles: {
          where: { campaign_id: campaignId },
          include: {
            role: true,
          },
        },
      },
    });
    if (!teacher) return { roles: [], permissions: [] };
    const roles = teacher.teacher_roles.map((tr) => tr.role.name);
    const permissions = Array.from(
      new Set(
        teacher.teacher_roles.flatMap((tr) =>
          Array.isArray(tr.role.permissions)
            ? tr.role.permissions
            : typeof tr.role.permissions === 'string'
              ? JSON.parse(tr.role.permissions)
              : [],
        ),
      ),
    );
    return { roles, permissions };
  }

  async login({ mobile_phone_number, password }) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { mobile_phone_number },
      include: {
        // organization_management: {
        //   where: { is_active: true },
        //   include: {
        //     organization: {
        //       include: {
        //         mosques: true,
        //       },
        //     },
        //   },
        // },
        // mosque_management: {
        //   where: { is_active: true },
        //   include: {
        //     mosque: {
        //       include: {
        //         organization: true,
        //         campaigns: { where: { status: true } },
        //       },
        //     },
        //   },
        // },
        // campaign_assignments: {
        //   where: { is_active: true },
        //   include: {
        //     campaign: {
        //       include: {
        //         mosque: { include: { organization: true } },
        //       },
        //     },
        //   },
        // },
        // groups: {
        //   include: {
        //     group: true,
        //     campaign: true,
        //   },
        // },
      },
    });

    if (!teacher) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: teacher.id,
      userType: 'TEACHER',
      role: teacher.role,
    };

    const { password: _, ...userInfo } = teacher;

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        ...userInfo,
        // managedOrganizations: teacher.organization_management.map((om) => ({
        //   id: om.organization.id,
        //   name: om.organization.name,
        //   role: om.role,
        //   organization: om.organization,
        // })),
        // managedMosques: teacher.mosque_management.map((mm) => ({
        //   id: mm.mosque.id,
        //   name: mm.mosque.name,
        //   role: mm.role,
        //   mosque: mm.mosque,
        // })),
        // teachingCampaigns: teacher.campaign_assignments.map((ca) => ({
        //   id: ca.campaign.id,
        //   name: ca.campaign.name,
        //   campaign: ca.campaign,
        // })),
        // teachingGroups: teacher.groups.map((tg) => ({
        //   group: tg.group,
        //   campaign: tg.campaign,
        // })),
      },
    };
  }
}
