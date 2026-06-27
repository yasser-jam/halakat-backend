import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubjectSessionDto {
  @ApiProperty({
    description: 'The subject ID',
    example: 1,
  })
  @IsInt()
  subject_id: number;

  @ApiProperty({
    description: 'The group ID',
    example: 1,
  })
  @IsInt()
  group_id: number;

  @ApiProperty({
    description: 'The campaign ID',
    example: 1,
  })
  @IsInt()
  campaign_id: number;

  @ApiProperty({
    description: 'The session title',
    example: 'Introduction to Tajweed',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the session',
    example: 'Focus on makharij al-huruf',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateSubjectSessionDto {
  @ApiPropertyOptional({
    description: 'The subject ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  subject_id?: number;

  @ApiPropertyOptional({
    description: 'The group ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  group_id?: number;

  @ApiPropertyOptional({
    description: 'The campaign ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  campaign_id?: number;

  @ApiPropertyOptional({
    description: 'The session title',
    example: 'Introduction to Tajweed',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the session',
    example: 'Updated session notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class SubjectSessionResponseDto {
  @ApiProperty({
    description: 'The subject session ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The subject ID',
    example: 1,
  })
  subject_id: number;

  @ApiProperty({
    description: 'The group ID',
    example: 1,
  })
  group_id: number;

  @ApiProperty({
    description: 'The campaign ID',
    example: 1,
  })
  campaign_id: number;

  @ApiProperty({
    description: 'The session title',
    example: 'Introduction to Tajweed',
  })
  title: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the session',
    example: 'Focus on makharij al-huruf',
  })
  notes?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:00:00Z',
  })
  updated_at: Date;
}
