import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Permission } from './permissions.enum';

export class CreateRoleDto {
  @ApiProperty({ example: 'Manager' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Role responsible for managing students and sessions',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: Permission,
    isArray: true,
    example: [
      Permission.STUDENT_MANAGEMENT,
      Permission.SAVING_SESSION_MANAGEMENT,
    ],
  })
  @IsArray()
  @IsEnum(Permission, { each: true })
  permissions: Permission[];
}
