import { Controller, Get, Param, Query } from '@nestjs/common';
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

  @ApiOperation({ summary: 'Get all surah templates (Quran metadata)' })
  @ApiResponse({
    status: 200,
    description: 'Returns all surah templates.',
  })
  @Get('templates')
  async getTemplates() {
    return this.sessionSurahService.getTemplates();
  }

  @ApiOperation({ summary: 'Get surah templates by surah number' })
  @ApiResponse({
    status: 200,
    description: 'Returns surah templates for the specified surah.',
  })
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
  @ApiResponse({
    status: 200,
    description: 'Returns surah templates within the specified page range.',
  })
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

  @ApiOperation({ summary: 'Look up a surah template by surah number + page number' })
  @ApiResponse({
    status: 200,
    description: 'Returns the matching surah template or null.',
  })
  @ApiQuery({ name: 'surahNumber', required: true, type: Number })
  @ApiQuery({ name: 'pageNumber', required: true, type: Number })
  @Get('templates/query')
  async queryTemplate(
    @Query('surahNumber') surahNumber: number,
    @Query('pageNumber') pageNumber: number,
  ) {
    return this.sessionSurahService.queryTemplate(
      Number(surahNumber),
      Number(pageNumber),
    );
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
