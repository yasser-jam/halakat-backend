import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MosqueService } from './mosque.service';
import { CreateMosqueDto } from './mosque.dto';

@ApiTags('mosques')
@Controller('mosques')
export class MosqueController {
  constructor(private readonly mosqueService: MosqueService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new mosque' })
  @ApiResponse({ status: 201, description: 'Mosque created' })
  @ApiBody({ type: CreateMosqueDto })
  create(@Body() createMosqueDto: CreateMosqueDto) {
    return this.mosqueService.create(createMosqueDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all mosques' })
  @ApiResponse({ status: 200, description: 'List of mosques' })
  findAll() {
    return this.mosqueService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get mosque by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Mosque found' })
  findOne(@Param('id') id: number) {
    return this.mosqueService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update mosque by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Mosque updated' })
  @ApiBody({ type: CreateMosqueDto })
  update(@Param('id') id: number, @Body() updateMosqueDto: CreateMosqueDto) {
    return this.mosqueService.update(id, updateMosqueDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete mosque by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Mosque deleted' })
  remove(@Param('id') id: number) {
    return this.mosqueService.remove(id);
  }
}
