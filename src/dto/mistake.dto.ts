import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMistakeDto {
  @ApiProperty({ example: 1, description: 'Campaign ID' })
  @IsNumber()
  campaign_id: number;

  @ApiProperty({ example: 'Skipped verse', description: 'Mistake title' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 5, description: 'Points to remove for this mistake' })
  @IsNumber()
  removed_points: number;
}

export class UpdateMistakeDto {
  @ApiProperty({ example: 1, description: 'Campaign ID' })
  @IsNumber()
  campaign_id: number;

  @ApiProperty({
    example: 'Skipped verse',
    description: 'Mistake title',
    required: false,
  })
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 5,
    description: 'Points to remove for this mistake',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  removed_points?: number;
}

export class ValidateMistakeIdDto {
  @ApiProperty({ example: 1, description: 'Mistake ID' })
  @IsNumber()
  id: number;
}
