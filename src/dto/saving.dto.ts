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

  @ApiProperty({
    example: 10,
    description: 'Page number where mistake occurred',
  })
  @IsInt()
  @IsNotEmpty()
  pageNumber: number;
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
  campaignId: number;

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
    type: [MistakeInSessionDto],
    description: 'List of mistakes during session',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MistakeInSessionDto)
  mistakes: MistakeInSessionDto[];
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

  @ApiProperty()
  start: number;

  @ApiProperty()
  end: number;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty({
    description: 'List of mistakes with page info',
    type: [MistakeInSessionDto],
  })
  mistakes: MistakeInSessionDto[];
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
  campaignId?: number;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
