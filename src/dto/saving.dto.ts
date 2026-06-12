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
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePagePortionDto {
  @ApiProperty({ example: 1, description: 'Surah number (1-114)' })
  @IsInt()
  @IsNotEmpty()
  surah_number: number;

  @ApiProperty({ example: 2, description: 'Page number within the surah' })
  @IsInt()
  @IsNotEmpty()
  page_number: number;

  @ApiProperty({
    example: [1, 3],
    description: 'IDs of mistakes made on this page',
  })
  @IsArray()
  @IsInt({ each: true })
  mistake_ids: number[];

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Evaluation ID for this portion (falls back to session-level evaluation)',
  })
  @IsOptional()
  @IsInt()
  evaluation_id?: number;
}

export class CreateRecitationSessionDto {
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

  @ApiProperty({
    example: 1,
    description: 'ID of the evaluation (provides minimum_marks threshold, fallback for portions without their own)',
  })
  @IsInt()
  @IsNotEmpty()
  evaluation_id: number;

  @ApiProperty({ example: 4, description: 'Rating (1-5)' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 1200, description: 'Duration in seconds' })
  @IsInt()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({ example: 'Good session', description: 'Optional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    type: [CreatePagePortionDto],
    description: 'List of pages with their surah, page numbers, and mistakes',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePagePortionDto)
  pages: CreatePagePortionDto[];
}

export class SessionErrorDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  mistakeId: number;

  @ApiProperty()
  pageNumber: number;

  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  reducedMarks?: number;
}

export class SessionPortionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  portionType: string;

  @ApiProperty({ required: false })
  surahId?: number;

  @ApiProperty({ required: false })
  surahNumber?: number;

  @ApiProperty({ required: false })
  surahName?: string;

  @ApiProperty({ required: false })
  surahWeight?: number;

  @ApiProperty()
  startPage: number;

  @ApiProperty()
  endPage: number;

  @ApiProperty({ required: false })
  portionScore?: number;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  evaluationId?: number;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty({ type: [SessionErrorDto] })
  errors: SessionErrorDto[];
}

export class RecitationSessionDto {
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
  rating: number;

  @ApiProperty()
  duration: number;

  @ApiProperty({ required: false })
  totalScore?: number;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty({ type: [SessionPortionDto] })
  portions: SessionPortionDto[];
}

export class FilterSavingSessionDto {
  @ApiProperty({ required: false, description: 'Student ID' })
  @IsOptional()
  @IsInt()
  studentId?: number;

  @ApiProperty({ required: false, description: 'Teacher ID' })
  @IsOptional()
  @IsInt()
  teacherId?: number;

  @ApiProperty({ required: false, description: 'Mistake ID' })
  @IsOptional()
  @IsInt()
  mistakeId?: number;

  @ApiProperty({ required: false, description: 'Campaign ID' })
  @IsOptional()
  @IsInt()
  campaign_id?: number;

  @ApiProperty({ required: false, description: 'Evaluation ID' })
  @IsOptional()
  @IsInt()
  evaluationId?: number;

  @ApiProperty({ required: false, description: 'Start date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiProperty({ required: false, description: 'End date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
