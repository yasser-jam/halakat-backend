import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SessionSurahService } from './session-surah.service';

@ApiTags('session-surahs')
@Controller('session-surahs')
export class SessionSurahController {
  constructor(private readonly sessionSurahService: SessionSurahService) {}

  @ApiOperation({ summary: 'Get all surah templates' })
  @ApiResponse({
    status: 200,
    description: 'Returns all surah templates.',
  })
  @Get('templates')
  async getTemplates() {
    return this.sessionSurahService.getTemplates();
  }

  @ApiOperation({ summary: 'Get surah templates by surah number' })
  @ApiParam({
    name: 'surahNumber',
    required: true,
    type: Number,
    description: 'The surah number (1-114)',
  })
  @Get('templates/surah/:surahNumber')
  async getTemplatesBySurah(@Param('surahNumber') surahNumber: number) {
    return this.sessionSurahService.getTemplatesBySurah(Number(surahNumber));
  }

  @ApiOperation({ summary: 'Get surah templates by page range' })
  @ApiQuery({ name: 'startPage', required: true, type: Number })
  @ApiQuery({ name: 'endPage', required: true, type: Number })
  @Get('templates/pages')
  async getTemplatesByPageRange(
    @Query('startPage') startPage: number,
    @Query('endPage') endPage: number,
  ) {
    return this.sessionSurahService.getTemplatesByPageRange(
      Number(startPage),
      Number(endPage),
    );
  }

  @ApiOperation({ summary: 'Get session surahs by session ID' })
  @ApiParam({
    name: 'sessionId',
    required: true,
    type: Number,
    description: 'The session ID',
  })
  @Get('session/:sessionId')
  async getSessionSurahsBySession(@Param('sessionId') sessionId: number) {
    return this.sessionSurahService.getSessionSurahsBySession(
      Number(sessionId),
    );
  }

  @ApiOperation({ summary: 'Update session surah' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The session surah ID',
  })
  @Put(':id')
  async updateSessionSurah(
    @Param('id') id: number,
    @Body()
    data: {
      isPassed?: boolean;
      score?: number;
      notes?: string;
    },
  ) {
    return this.sessionSurahService.updateSessionSurah(Number(id), data);
  }

  @ApiOperation({ summary: 'Add mistake to session surah' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The session surah ID',
  })
  @Post(':id/mistakes')
  async addMistakeToSessionSurah(
    @Param('id') id: number,
    @Body() data: { mistakeId: number },
  ) {
    return this.sessionSurahService.addMistakeToSessionSurah(
      Number(id),
      data.mistakeId,
    );
  }

  @ApiOperation({ summary: 'Remove mistake from session surah' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The session surah ID',
  })
  @Delete(':id/mistakes/:mistakeId')
  async removeMistakeFromSessionSurah(
    @Param('id') id: number,
    @Param('mistakeId') mistakeId: number,
  ) {
    return this.sessionSurahService.removeMistakeFromSessionSurah(
      Number(id),
      Number(mistakeId),
    );
  }

  @ApiOperation({ summary: 'Get session surah statistics' })
  @ApiParam({
    name: 'sessionId',
    required: true,
    type: Number,
    description: 'The session ID',
  })
  @Get('stats/:sessionId')
  async getSessionSurahStats(@Param('sessionId') sessionId: number) {
    return this.sessionSurahService.getSessionSurahStats(Number(sessionId));
  }

  @ApiOperation({ summary: 'Get list of all surahs with names and numbers' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all surahs with their numbers and names.',
  })
  @Get('surahs')
  async getSurahsList() {
    return this.sessionSurahService.getSurahsList();
  }
}
