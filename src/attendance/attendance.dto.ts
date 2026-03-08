import {
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
  IsInt,
  Min,
  IsISO8601,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @ApiProperty()
  @IsNumber()
  campaign_id: number;

  @ApiProperty()
  @IsNumber()
  group_id: number;

  @ApiProperty()
  @IsNumber()
  student_id: number;

  @ApiProperty()
  @IsDateString()
  takenDate: string;

  @ApiProperty()
  @IsNumber()
  delayTime: number;

  @ApiProperty()
  @IsString()
  status: string;
}

export class BulkUpdateAttendanceDto {
  @ApiProperty()
  @IsInt()
  student_id: number;

  @ApiProperty()
  @IsInt()
  campaign_id: number;

  @ApiProperty({ enum: ['NOT_TAKEN', 'ATTEND', 'DELAY', 'MISSED'] })
  @IsEnum(['NOT_TAKEN', 'ATTEND', 'DELAY', 'MISSED'])
  status: string;

  @ApiProperty()
  @IsInt()
  @Min(-1)
  delay: number;

  @ApiProperty({ default: '2025-06-19' })
  @IsISO8601()
  date: string;
}

export class UpdateAttendanceDto extends CreateAttendanceDto {}

export class CreateOrUpdateAttendanceRecordDto {
  @ApiProperty({ description: 'Student ID' })
  @IsNumber()
  student_id: number;

  @ApiProperty({ description: 'Group ID' })
  @IsNumber()
  group_id: number;

  @ApiProperty({ description: 'Campaign ID' })
  @IsNumber()
  campaign_id: number;

  @ApiProperty({ description: 'Date of attendance (ISO 8601 format)', example: '2025-12-14' })
  @IsDateString()
  taken_date: string;

  @ApiProperty({ description: 'Attendance status', enum: ['NOT_TAKEN', 'ATTEND', 'DELAY', 'MISSED'] })
  @IsString()
  status: string;

  @ApiPropertyOptional({ description: 'Delay time in minutes (optional)' })
  @IsOptional()
  @IsNumber()
  delay_time?: number;
}
