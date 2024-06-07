import {
  IsString,
  IsInt,
  IsArray,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsNumber()
  teacherId: number;

  @IsArray()
  studentsIds?: number[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  campaignIds?: number[];
}

export class UpdateGroupDto extends CreateGroupDto {}

export class GroupListDto {
  @ApiProperty()
  @IsInt()
  id: number;
}

export class ValidateGroupIdDto {
  @ApiProperty()
  @IsInt()
  id: number;
}
