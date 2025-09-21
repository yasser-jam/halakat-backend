import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SessionSurahService {
  constructor(private prisma: PrismaService) {}

  async getTemplates() {
    return this.prisma.sessionSurahTemplate.findMany({
      orderBy: [
        { surahNumber: 'asc' },
        { pageNumber: 'asc' }
      ]
    });
  }

  async getTemplatesBySurah(surahNumber: number) {
    return this.prisma.sessionSurahTemplate.findMany({
      where: { surahNumber },
      orderBy: { pageNumber: 'asc' }
    });
  }

  async getTemplatesByPageRange(startPage: number, endPage: number) {
    return this.prisma.sessionSurahTemplate.findMany({
      where: {
        pageNumber: {
          gte: startPage,
          lte: endPage
        }
      },
      orderBy: { pageNumber: 'asc' }
    });
  }

  async getSessionSurahsBySession(sessionId: number) {
    return this.prisma.sessionSurah.findMany({
      where: { saving_session_id: sessionId },
      include: {
        template: true,
        mistakes: {
          include: { mistake: true }
        }
      },
      orderBy: { template: { pageNumber: 'asc' } }
    });
  }

  async updateSessionSurah(sessionSurahId: number, data: {
    isPassed?: boolean;
    score?: number;
    notes?: string;
  }) {
    return this.prisma.sessionSurah.update({
      where: { id: sessionSurahId },
      data,
      include: {
        template: true,
        mistakes: {
          include: { mistake: true }
        }
      }
    });
  }

  async addMistakeToSessionSurah(sessionSurahId: number, mistakeId: number) {
    return this.prisma.mistakeInSession.create({
      data: {
        session_surah_id: sessionSurahId,
        mistake_id: mistakeId
      },
      include: {
        mistake: true
      }
    });
  }

  async removeMistakeFromSessionSurah(sessionSurahId: number, mistakeId: number) {
    return this.prisma.mistakeInSession.deleteMany({
      where: {
        session_surah_id: sessionSurahId,
        mistake_id: mistakeId
      }
    });
  }

  async getSessionSurahStats(sessionId: number) {
    const sessionSurahs = await this.prisma.sessionSurah.findMany({
      where: { saving_session_id: sessionId },
      include: {
        template: true,
        mistakes: {
          include: { mistake: true }
        }
      }
    });

    const totalSurahs = sessionSurahs.length;
    const passedSurahs = sessionSurahs.filter(s => s.isPassed).length;
    const failedSurahs = totalSurahs - passedSurahs;
    const totalMistakes = sessionSurahs.reduce((sum, s) => sum + s.mistakes.length, 0);
    const averageScore = sessionSurahs.reduce((sum, s) => sum + (s.score || 0), 0) / totalSurahs;

    return {
      totalSurahs,
      passedSurahs,
      failedSurahs,
      totalMistakes,
      averageScore: Math.round(averageScore * 100) / 100,
      passRate: Math.round((passedSurahs / totalSurahs) * 100)
    };
  }

  async getSurahsList() {
    const surahs = await this.prisma.sessionSurahTemplate.findMany({
      select: {
        surahNumber: true,
        surahName: true,
      },
      distinct: ['surahNumber'],
      orderBy: { surahNumber: 'asc' }
    });

    return surahs.map(surah => ({
      number: surah.surahNumber,
      name: surah.surahName
    }));
  }
}
