import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty()
  @IsString()
  mobile_phone_number: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class LoginTeacherDto {
  @ApiProperty()
  @IsString()
  mobile_phone_number: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class LoginStudentDto {
  @ApiProperty()
  @IsString()
  student_mobile: string;

  @ApiProperty()
  @IsString()
  password: string;
}
