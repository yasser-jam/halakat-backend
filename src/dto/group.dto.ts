import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: true })
  @IsInt({ each: true })
  currentTeacherId?: number;

  @ApiProperty({ required: true })
  @IsInt()
  class: number;
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

export class GroupAssignDto {
  @ApiProperty()
  @IsInt()
  studentId: number;

  @ApiProperty()
  @IsInt()
  campaignId: number;

  @ApiProperty()
  @IsInt()
  groupId: number;
}
