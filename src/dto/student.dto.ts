import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  IsDate,
  IsEnum,
  IsJSON,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum Status {
  ALIVE = 'ALIVE',
  DEAD = 'DEAD',
  MISSED = 'MISSED',
}

export enum MaritalStatus {
  MARRIED = 'MARRIED',
  SEPARATED = 'SEPARATED',
  DIVORCED = 'DIVORCED',
}

export class CreateStudentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  current_mosque_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  educational_class?: string;

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  student_mobile?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  school?: string;

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
  student_health_status?: string;

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

  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  father_status: Status;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  father_job?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  father_income_level?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  father_education_level?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  father_health_status?: string;

  @ApiProperty()
  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  father_phone_number?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  father_work_number?: string;

  @ApiProperty()
  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  mother_name?: string;

  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  @ApiProperty({ required: false })
  @IsOptional()
  mother_status?: Status;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mother_job?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mother_income_level?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mother_education_level?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mother_health_status?: string;

  @ApiProperty()
  @IsString()
  mother_phone_number: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mother_home_number?: string;

  @ApiProperty({ enum: MaritalStatus })
  @IsEnum(MaritalStatus)
  parent_marital_status: MaritalStatus;

  @ApiProperty()
  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  student_mobile_number?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  student_home_number?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  original_residence_address_area?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  original_residence_address_street?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  original_residence_address_building?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  original_residence_address_floor?: string;

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  current_residence_address_floor?: string;

  @ApiProperty({ type: 'object' })
  @IsJSON()
  preserved_parts: JSON;

  @ApiProperty({ type: 'object' })
  @IsJSON()
  parts_tested_by_the_endowments: JSON;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image_url?: string;
}

export class UpdateStudentDto extends CreateStudentDto {}

export class StudentListDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  first_name: string;

  @ApiProperty()
  @IsString()
  last_name: string;

  @ApiProperty()
  @IsString()
  student_mobile_number: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  current_mosque_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  educational_class?: string;
}

export class ValidateStudentIdDto {
  @ApiProperty()
  @IsInt()
  id: number;
}
