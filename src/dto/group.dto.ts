import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsInt()
  campaignId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  teacherId?: number;
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
