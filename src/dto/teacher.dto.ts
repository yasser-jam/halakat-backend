import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  IsDate,
  IsJSON,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class TeacherRole {
  @IsInt() roleId: number;
  @IsInt() groupId: number;
  @IsInt() campaignId: number;
}

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @ApiProperty({ required: true })
  mobile_phone_number?: string;

  @ApiProperty({ required: true })
  @IsString()
  password?: string;
}

export class LoginDto {
  @ApiProperty()
  @IsString()
  @ApiProperty({ required: true })
  mobile_phone_number?: string;

  @ApiProperty({ required: true })
  @IsString()
  password?: string;
}

export class CreateTeacherDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  educational_level?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  university_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  college_name?: string;

  @ApiProperty()
  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  first_name?: string;

  @ApiProperty()
  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  last_name?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birth_date?: Date;

  @ApiProperty({ required: true })
  @IsString()
  mobile_phone_number: string;

  @ApiProperty()
  @IsBoolean()
  @ApiProperty({ required: false })
  @IsOptional()
  in_another_mosque?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  other_mosque_names?: string;

  @ApiProperty()
  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  special_talent?: string;

  @ApiProperty()
  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  father_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  current_residence_address_area?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  current_residence_address_street?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  current_residence_address_building?: string;

  // todo: make required
  @ApiProperty({ type: 'object' })
  @IsOptional()
  @IsJSON()
  preserved_parts: any;

  // todo: make required

  @ApiProperty({ type: 'object' })
  @IsOptional()
  @IsJSON()
  parts_tested_by_the_endowments: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  is_mojaz: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  is_working: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  job_role?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  workplace_name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeacherRole)
  teacherRoles: TeacherRole[];
}

export class UpdateTeacherDto extends CreateTeacherDto {}

export class TeacherListDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  first_name: string;

  @ApiProperty()
  @IsString()
  last_name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  educational_class?: string;
}

export class ValidateTeacherIdDto {
  @ApiProperty()
  @IsInt()
  id: number;
  campaign_id: number;
}
