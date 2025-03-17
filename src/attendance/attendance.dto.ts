import { IsString, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

export class UpdateAttendanceDto extends CreateAttendanceDto {}
