import {
  IsDate,
  IsInt,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignDto {
  @ApiProperty({ required: false })
  @IsString()
  name: string;
  @IsDate()
  startDate: Date;
  // @IsDate()
  // endDate: Date;
  // @IsDate()
  // assignStartDate: Date;
  // @IsDate()
  // assignEndDate: Date;
  // @IsBoolean()
  // isCampaignContinous: boolean;
  // @IsBoolean()
  // limitedStudentsCount: boolean;
  // @IsNumber()
  // studentsCount: number;
  // @IsBoolean()
  // assignByLink: boolean;
  // @IsString()
  // completeCountApproach:
  //   | 'UNLIMIT_ASSIGN'
  //   | 'HOLD_ASSIGN'
  //   | 'PEND_ASSIGN'
  //   | 'STOP_ASSIGN';

  // @IsString()
  // timingApproach: 'pray_time' | 'hours';

  // @IsString()
  // days: string;

  // @IsDate()
  // startTime: Date;

  // @IsDate()
  // endTime: Date;
}

export class UpdateCampaignDto {
  @ApiProperty({ example: 'Summer Quran Program', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '2024-06-15T08:00:00.000Z', required: false })
  @IsOptional()
  @IsDate()
  start_date?: Date;

  @ApiProperty({ example: '2024-08-15T08:00:00.000Z', required: false })
  @IsOptional()
  @IsDate()
  end_date?: Date;

  @ApiProperty({ example: '2024-06-10T08:00:00.000Z', required: false })
  @IsOptional()
  @IsDate()
  assign_start_date?: Date;

  @ApiProperty({ example: '2024-06-14T08:00:00.000Z', required: false })
  @IsOptional()
  @IsDate()
  assign_end_date?: Date;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  is_campaign_continuous?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  limited_students_count?: boolean;

  @ApiProperty({ example: 30, required: false })
  @IsOptional()
  @IsInt()
  students_count?: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  assign_by_link?: boolean;

  @ApiProperty({ example: 'UNLIMIT_ASSIGN', required: false })
  @IsOptional()
  @IsString()
  complete_count_approach?: string;

  @ApiProperty({ example: 'Sat,Sun,Mon', required: false })
  @IsOptional()
  @IsString()
  days?: string;

  @ApiProperty({ example: 'hours', required: false })
  @IsOptional()
  @IsString()
  timing_approach?: string;

  @ApiProperty({ example: '08:00', required: false })
  @IsOptional()
  @IsString()
  start_time?: string;

  @ApiProperty({ example: '12:00', required: false })
  @IsOptional()
  @IsString()
  end_time?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiProperty({
    type: 'object',
    required: false,
    example: { notes: 'Special summer program', budget: 5000 },
  })
  @IsOptional()
  metadata?: any;
}

export class ValidateCampaginIdDto {
  @ApiProperty()
  @IsInt()
  id: number;
}
