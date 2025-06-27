// import {
//   IsString,
//   IsNumber,
//   IsDateString,
//   IsEnum,
//   IsInt,
//   Min,
//   IsISO8601,
// } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

// export class CreateAttendanceDto {
//   @ApiProperty()
//   @IsNumber()
//   campaign_id: number;

//   @ApiProperty()
//   @IsNumber()
//   group_id: number;

//   @ApiProperty()
//   @IsNumber()
//   student_id: number;

//   @ApiProperty()
//   @IsDateString()
//   takenDate: string;

//   @ApiProperty()
//   @IsNumber()
//   delayTime: number;

//   @ApiProperty()
//   @IsString()
//   status: string;
// }

// export class BulkUpdateAttendanceDto {
//   @ApiProperty()
//   @IsInt()
//   student_id: number;

//   @ApiProperty()
//   @IsInt()
//   campaign_id: number;

//   @ApiProperty({ enum: ['NOT_TAKEN', 'ATTEND', 'DELAY', 'MISSED'] })
//   @IsEnum(['NOT_TAKEN', 'ATTEND', 'DELAY', 'MISSED'])
//   status: string;

//   @ApiProperty()
//   @IsInt()
//   @Min(-1)
//   delay: number;

//   @ApiProperty({ default: '2025-06-19' })
//   @IsISO8601()
//   date: string;
// }

// export class UpdateAttendanceDto extends CreateAttendanceDto {}
