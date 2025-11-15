import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDateString } from 'class-validator';

export class GetReportDto {
  @ApiProperty({ description: 'Campaign ID' })
  @IsNumber()
  campaign_id: number;

  @ApiProperty({ description: 'Start date in ISO format', example: '2024-01-01' })
  @IsDateString()
  start_date: string;

  @ApiProperty({ description: 'End date in ISO format', example: '2024-01-31' })
  @IsDateString()
  end_date: string;
}

export class PhoneNumbersDto {
  @ApiProperty({ description: 'Student mobile number' })
  studentMobile: string;

  @ApiProperty({ description: 'Father phone number', required: false })
  fatherPhone?: string;

  @ApiProperty({ description: 'Mother phone number', required: false })
  motherPhone?: string;

  @ApiProperty({ description: 'Student mobile number (alternative)', required: false })
  studentMobileNumber?: string;

  @ApiProperty({ description: 'Student home number', required: false })
  studentHomeNumber?: string;

  @ApiProperty({ description: 'Mother home number', required: false })
  motherHomeNumber?: string;

  @ApiProperty({ description: 'Father work number', required: false })
  fatherWorkNumber?: string;
}

export class MissedDateDto {
  @ApiProperty({ description: 'Date when student was missed' })
  date: Date;

  @ApiProperty({ description: 'Group title where student was missed' })
  groupTitle: string;
}

export class MissedStudentDto {
  @ApiProperty({ description: 'Student ID' })
  studentId: number;

  @ApiProperty({ description: 'Student first name' })
  firstName: string;

  @ApiProperty({ description: 'Student last name' })
  lastName: string;

  @ApiProperty({ description: 'All available phone numbers', type: PhoneNumbersDto })
  phoneNumbers: PhoneNumbersDto;

  @ApiProperty({ description: 'Array of missed dates', type: [MissedDateDto] })
  missedDates: MissedDateDto[];
}

export class DelayRecordDto {
  @ApiProperty({ description: 'Date when student was delayed' })
  date: Date;

  @ApiProperty({ description: 'Delay time in minutes' })
  delayTime: number;

  @ApiProperty({ description: 'Group title where student was delayed' })
  groupTitle: string;
}

export class DelayedStudentDto {
  @ApiProperty({ description: 'Student ID' })
  studentId: number;

  @ApiProperty({ description: 'Student first name' })
  firstName: string;

  @ApiProperty({ description: 'Student last name' })
  lastName: string;

  @ApiProperty({ description: 'Array of delay records', type: [DelayRecordDto] })
  delays: DelayRecordDto[];
}

export class LessonDto {
  @ApiProperty({ description: 'Category name' })
  categoryName: string;

  @ApiProperty({ description: 'Group title' })
  groupTitle: string;

  @ApiProperty({ description: 'Number of lessons created' })
  lessonsCount: number;
}

export class GlobalInfoDto {
  @ApiProperty({ description: 'Total number of students in campaign' })
  studentsCount: number;

  @ApiProperty({ description: 'Total number of teachers in campaign' })
  teachersCount: number;

  @ApiProperty({ description: 'Number of students who attended at least once' })
  attendStudents: number;

  @ApiProperty({ description: 'Total number of delay occurrences' })
  delayedStudentsCount: number;
}

export class SavingSessionsDto {
  @ApiProperty({ description: 'Total number of saving sessions' })
  total: number;

  @ApiProperty({ description: 'Number of passed saving sessions' })
  passed: number;

  @ApiProperty({ description: 'Number of not passed saving sessions' })
  notPassed: number;
}

export class ReportResponseDto {
  @ApiProperty({ description: 'Global campaign information', type: GlobalInfoDto })
  globalInfo: GlobalInfoDto;

  @ApiProperty({ description: 'Lessons created by category and group', type: [LessonDto] })
  lessons: LessonDto[];

  @ApiProperty({ description: 'Saving sessions statistics', type: SavingSessionsDto })
  savingSessions: SavingSessionsDto;

  @ApiProperty({ description: 'Students who missed attendance', type: [MissedStudentDto] })
  missedStudents: MissedStudentDto[];

  @ApiProperty({ description: 'Students with delays', type: [DelayedStudentDto] })
  delayedStudents: DelayedStudentDto[];
}

