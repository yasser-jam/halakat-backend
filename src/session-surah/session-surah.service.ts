import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SessionSurahService {
  constructor(private prisma: PrismaService) {}

  async getTemplates() {
    return this.prisma.sessionSurahTemplate.findMany({
      orderBy: [{ surahNumber: 'asc' }, { pageNumber: 'asc' }],
    });
  }

  async getTemplatesBySurah(surahNumber: number) {
    return this.prisma.sessionSurahTemplate.findMany({
      where: { surahNumber },
      orderBy: { pageNumber: 'asc' },
    });
  }

  async getTemplatesByPageRange(startPage: number, endPage: number) {
    return this.prisma.sessionSurahTemplate.findMany({
      where: {
        pageNumber: {
          gte: startPage,
          lte: endPage,
        },
      },
      orderBy: { pageNumber: 'asc' },
    });
  }

  async queryTemplate(surahNumber: number, pageNumber: number) {
    return this.prisma.sessionSurahTemplate.findFirst({
      where: { surahNumber, pageNumber },
    });
  }

  async getSurahsList() {
    const surahs = await this.prisma.sessionSurahTemplate.findMany({
      select: {
        surahNumber: true,
        surahName: true,
      },
      distinct: ['surahNumber'],
      orderBy: { surahNumber: 'asc' },
    });

    return surahs.map((surah) => ({
      number: surah.surahNumber,
      name: surah.surahName,
    }));
  }
}
