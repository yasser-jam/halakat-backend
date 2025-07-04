import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateMistakeDto {
  @ApiProperty({ example: 1, description: 'Campaign ID' })
  @IsNumber()
  campaign_id: number;

  @ApiProperty({ example: 'Skipped verse', description: 'Mistake title' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 5, description: 'Points to remove for this mistake' })
  @IsNumber()
  minimum_marks: number;
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
  minimum_marks?: number;
}

export class ValidateMistakeIdDto {
  @ApiProperty({ example: 1, description: 'Mistake ID' })
  @IsNumber()
  id: number;
}

export class CampaignMistakeItemDto {
  @ApiProperty({
    example: 1,
    required: false,
    description: 'Optional ID if it exists (for update)',
  })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({ example: 'Pronunciation error' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Student mispronounced the letter Qaf' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class AssertCampaignMistakesDto {
  @ApiProperty({ example: 1, description: 'Campaign ID' })
  @IsInt()
  @IsNotEmpty()
  campaignId: number;

  @ApiProperty({
    type: [CampaignMistakeItemDto],
    description: 'Array of mistake definitions to sync',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CampaignMistakeItemDto)
  mistakes: CampaignMistakeItemDto[];
}
