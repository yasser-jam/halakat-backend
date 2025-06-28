import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({ example: 1 })
  mosque_id: number;

  @ApiProperty({ example: 'Group A' })
  title: string;

  @ApiProperty({ example: 5, required: false })
  class?: number;

  @ApiProperty({ example: 1, required: false })
  current_teacher_id?: number;
}
