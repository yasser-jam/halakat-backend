import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SavingSessionService } from './saving-session.service';
import {
  CreateRecitationSessionDto,
  FilterSavingSessionDto,
  RecitationSessionDto,
} from '../dto/saving.dto';

@ApiTags('saving-sessions')
@Controller('saving-sessions')
export class SavingSessionController {
  constructor(private readonly savingSessionService: SavingSessionService) {}

  @ApiOperation({ summary: 'Create a new recitation session with dynamic portion splitting' })
  @ApiResponse({
    status: 201,
    description: 'The recitation session has been successfully created.',
    type: RecitationSessionDto,
  })
  @Post()
  async create(@Body() dto: CreateRecitationSessionDto) {
    return this.savingSessionService.create(dto);
  }

  @ApiOperation({ summary: 'Get all recitation sessions' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all recitation sessions.',
    type: [RecitationSessionDto],
  })
  @Get()
  async findAll() {
    return this.savingSessionService.getAll();
  }

  @ApiOperation({ summary: 'Filter recitation sessions' })
  @ApiResponse({
    status: 200,
    description: 'Returns filtered recitation sessions.',
  })
  @Get('filter')
  @ApiQuery({ name: 'studentId', required: false, type: Number })
  @ApiQuery({ name: 'teacherId', required: false, type: Number })
  @ApiQuery({ name: 'mistakeId', required: false, type: Number })
  @ApiQuery({ name: 'campaignId', required: false, type: Number })
  @ApiQuery({ name: 'evaluationId', required: false, type: Number })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    type: String,
    example: '2025-12-31',
  })
  filter(@Query() query: FilterSavingSessionDto) {
    return this.savingSessionService.filter(query);
  }

  @ApiOperation({ summary: 'Get recitation session by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a recitation session by its ID.',
    type: RecitationSessionDto,
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The ID of the recitation session',
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.savingSessionService.getById(id);
  }

  @ApiOperation({ summary: 'Delete Recitation Session' })
  @ApiResponse({
    status: 200,
    description: 'Deleted Successfully',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The ID of the recitation session',
  })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.savingSessionService.remove(Number(id));
  }
}
