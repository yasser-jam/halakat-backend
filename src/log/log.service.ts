import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LogEvent } from '@prisma/client';

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  async createLog(data: {
    event: LogEvent;
    teacherId?: number;
    metadata?: string;
  }) {
    return this.prisma.log.create({
      data: {
        event: data.event,
        teacherId: data.teacherId,
      },
    });
  }

  async getLogs(params: { teacherId?: number; event?: LogEvent }) {
    const { teacherId, event } = params;

    return this.prisma.log.findMany({
      where: {
        ...(teacherId && { teacherId }),
        ...(event && { event }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
