import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCurriculumLessonSessionDto {
  @ApiProperty({
    description: 'The curriculum node ID',
    example: 1,
  })
  @IsInt()
  node_id: number;

  @ApiProperty({
    description: 'The group ID',
    example: 1,
  })
  @IsInt()
  group_id: number;

  @ApiProperty({
    description: 'The teacher ID',
    example: 1,
  })
  @IsInt()
  teacher_id: number;

  @ApiProperty({
    description: 'The campaign ID',
    example: 1,
  })
  @IsInt()
  campaign_id: number;

  @ApiProperty({
    description: 'The session number within the node',
    example: 1,
  })
  @IsInt()
  session_number: number;

  @ApiPropertyOptional({
    description: 'The date of the lesson session',
    example: '2024-01-15T10:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    description: 'Whether the session is finished',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is_finished?: boolean;

  @ApiPropertyOptional({
    description: 'Duration of the session in minutes',
    example: 60,
  })
  @IsOptional()
  @IsInt()
  duration_minutes?: number;

  @ApiPropertyOptional({
    description: 'Additional notes about the session',
    example: 'Students were very engaged today',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Whether the session was late',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is_late?: boolean;
}

export class UpdateCurriculumLessonSessionDto {
  @ApiPropertyOptional({
    description: 'The curriculum node ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  node_id?: number;

  @ApiPropertyOptional({
    description: 'The group ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  group_id?: number;

  @ApiPropertyOptional({
    description: 'The teacher ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  teacher_id?: number;

  @ApiPropertyOptional({
    description: 'The campaign ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  campaign_id?: number;

  @ApiPropertyOptional({
    description: 'The session number within the node',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  session_number?: number;

  @ApiPropertyOptional({
    description: 'The date of the lesson session',
    example: '2024-01-15T10:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    description: 'Whether the session is finished',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_finished?: boolean;

  @ApiPropertyOptional({
    description: 'Duration of the session in minutes',
    example: 60,
  })
  @IsOptional()
  @IsInt()
  duration_minutes?: number;

  @ApiPropertyOptional({
    description: 'Additional notes about the session',
    example: 'Updated notes about the session',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Whether the session was late',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  is_late?: boolean;
}

export class CurriculumLessonSessionResponseDto {
  @ApiProperty({
    description: 'The lesson session ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The curriculum node ID',
    example: 1,
  })
  node_id: number;

  @ApiProperty({
    description: 'The group ID',
    example: 1,
  })
  group_id: number;

  @ApiProperty({
    description: 'The teacher ID',
    example: 1,
  })
  teacher_id: number;

  @ApiProperty({
    description: 'The campaign ID',
    example: 1,
  })
  campaign_id: number;

  @ApiProperty({
    description: 'The session number within the node',
    example: 1,
  })
  session_number: number;

  @ApiPropertyOptional({
    description: 'The date of the lesson session',
    example: '2024-01-15T10:00:00Z',
  })
  date?: Date;

  @ApiProperty({
    description: 'Whether the session is finished',
    example: true,
  })
  is_finished: boolean;

  @ApiPropertyOptional({
    description: 'Duration of the session in minutes',
    example: 60,
  })
  duration_minutes?: number;

  @ApiPropertyOptional({
    description: 'Additional notes about the session',
    example: 'Students were very engaged today',
  })
  notes?: string;

  @ApiProperty({
    description: 'Whether the session was late',
    example: false,
  })
  is_late: boolean;

  @ApiProperty({
    description: 'When the session was created',
    example: '2024-01-15T09:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'When the session was last updated',
    example: '2024-01-15T11:00:00Z',
  })
  updated_at: Date;

  @ApiPropertyOptional({
    description: 'Associated lesson node information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: 'Introduction to Arabic' },
      description: {
        type: 'string',
        example: 'Basic Arabic lesson',
        nullable: true,
      },
      node_type: { type: 'string', example: 'lesson', nullable: true },
      status: { type: 'string', example: 'active' },
    },
  })
  lesson_node?: {
    id: number;
    name: string;
    description?: string;
    node_type?: string;
    status: string;
  };

  @ApiPropertyOptional({
    description: 'Associated group information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      title: { type: 'string', example: 'Beginners Group A' },
    },
  })
  group?: {
    id: number;
    title: string;
  };

  @ApiPropertyOptional({
    description: 'Associated teacher information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      first_name: { type: 'string', example: 'Ahmed', nullable: true },
      last_name: { type: 'string', example: 'Al-Rashid', nullable: true },
    },
  })
  teacher?: {
    id: number;
    first_name?: string;
    last_name?: string;
  };

  @ApiPropertyOptional({
    description: 'Associated campaign information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: 'Spring 2024 Campaign' },
    },
  })
  campaign?: {
    id: number;
    name: string;
  };
}
