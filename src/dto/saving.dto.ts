import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MistakeInSessionDto {
  @ApiProperty({ example: 1, description: 'ID of the mistake' })
  @IsInt()
  @IsNotEmpty()
  mistakeId: number;
}

export class SessionSurahDto {
  @ApiProperty({ example: 1, description: 'Template ID for the surah' })
  @IsInt()
  @IsNotEmpty()
  templateId: number;

  @ApiProperty({ example: 1, description: 'Evaluation ID for the surah' })
  @IsInt()
  @IsNotEmpty()
  evaluationId: number;

  @ApiProperty({ example: true, description: 'Whether the surah was passed' })
  @IsOptional()
  isPassed?: boolean;

  @ApiProperty({ example: 85, description: 'Score for the surah' })
  @IsOptional()
  @IsInt()
  score?: number;

  @ApiProperty({ example: 90, description: 'Raw score before applying weight' })
  @IsOptional()
  @IsInt()
  rawScore?: number;

  @ApiProperty({
    example: 90.5,
    description: 'Weighted score after applying template weight',
  })
  @IsOptional()
  weightedScore?: number;

  @ApiProperty({
    example: true,
    description: 'Whether this template was completed',
  })
  @IsOptional()
  isCompleted?: boolean;

  @ApiProperty({
    example: 'Good recitation',
    description: 'Notes about the surah',
  })
  @IsOptional()
  notes?: string;

  @ApiProperty({
    type: [MistakeInSessionDto],
    description: 'Mistakes made in this surah',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MistakeInSessionDto)
  mistakes?: MistakeInSessionDto[];
}

export class CreateSavingSessionDto {
  @ApiProperty({ example: 1, description: 'ID of the teacher' })
  @IsInt()
  @IsNotEmpty()
  teacherId: number;

  @ApiProperty({ example: 1, description: 'ID of the student' })
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @ApiProperty({ example: 1, description: 'ID of the campaign' })
  @IsInt()
  @IsNotEmpty()
  campaign_id: number;

  @ApiProperty({ example: 1, description: 'ID of the evaluation (optional)' })
  @IsOptional()
  @IsInt()
  evaluation_id?: number;

  @ApiProperty({ example: 1, description: 'Start page number' })
  @IsInt()
  @IsNotEmpty()
  start: number;

  @ApiProperty({ example: 5, description: 'End page number' })
  @IsInt()
  @IsNotEmpty()
  end: number;

  @ApiProperty({ example: 4, description: 'Rating (1-5)' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 1200, description: 'Duration in seconds' })
  @IsInt()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({
    example: 85.5,
    description: 'Total score from all completed templates',
  })
  @IsOptional()
  totalScore?: number;

  @ApiProperty({
    example: 100.0,
    description: 'Maximum possible score for completed templates',
  })
  @IsOptional()
  maxPossibleScore?: number;

  @ApiProperty({
    example: true,
    description: 'Whether the overall session passed',
  })
  @IsOptional()
  overallPassed?: boolean;

  @ApiProperty({
    type: [SessionSurahDto],
    description: 'List of surahs recited in this session',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SessionSurahDto)
  sessionSurahs: SessionSurahDto[];
}

export class SavingSessionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  teacherId: number;

  @ApiProperty()
  studentId: number;

  @ApiProperty()
  campaignId: number;

  @ApiProperty({ required: false })
  evaluationId?: number;

  @ApiProperty()
  start: number;

  @ApiProperty()
  end: number;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  duration: number;

  @ApiProperty({ required: false })
  totalScore?: number;

  @ApiProperty({ required: false })
  maxPossibleScore?: number;

  @ApiProperty({ required: false })
  overallPassed?: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty({
    description: 'List of surahs recited in this session',
    type: [SessionSurahDto],
  })
  sessionSurahs: SessionSurahDto[];
}

export class FilterSavingSessionDto {
  @IsOptional()
  @IsInt()
  studentId?: number;

  @IsOptional()
  @IsInt()
  teacherId?: number;

  @IsOptional()
  @IsInt()
  mistakeId?: number;

  @IsOptional()
  @IsInt()
  campaign_id?: number;

  @IsOptional()
  @IsInt()
  evaluationId?: number;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
