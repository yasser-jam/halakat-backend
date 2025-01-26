import { IsBoolean, IsDate, IsInt, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignDto {
  @ApiProperty({ required: false })
  @IsString()
  name: string;
  @IsDate()
  startDate: Date;
  @IsDate()
  endDate: Date;
  @IsDate()
  assignStartDate: Date;
  @IsDate()
  assignEndDate: Date;
  @IsBoolean()
  isCampaignContinous: boolean;
  @IsBoolean()
  limitedStudentsCount: boolean;
  @IsNumber()
  studentsCount: number;
  @IsBoolean()
  assignByLink: boolean;
  @IsString()
  completeCountApproach:
    | 'UNLIMIT_ASSIGN'
    | 'HOLD_ASSIGN'
    | 'PEND_ASSIGN'
    | 'STOP_ASSIGN';

  @IsString()
  timingApproach: 'pray_time' | 'hours';

  @IsString()
  days: string;

  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;
}

export class UpdateCampaignDto extends CreateCampaignDto {}

export class ValidateCampaginIdDto {
  @ApiProperty()
  @IsInt()
  id: number;
}
