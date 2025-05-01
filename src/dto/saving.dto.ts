import { IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Mistake } from '@prisma/client';

export class CreateSavingDto {
  @ApiProperty()
  @IsNumber()
  campaign_id: number;

  @ApiProperty()
  @IsNumber()
  teacher_id: number;

  @ApiProperty()
  @IsNumber()
  student_id: number;

  @ApiProperty()
  @IsNumber()
  start: number;

  @ApiProperty()
  @IsNumber()
  end: number;

  @ApiProperty()
  @IsNumber()
  duration: number;

  @ApiProperty()
  @IsNumber()
  rating: number;

  @ApiProperty()
  @IsDateString()
  created_at: Date;

  mistakes?: Mistake[];
}

export class UpdateSavingDto extends CreateSavingDto {}
