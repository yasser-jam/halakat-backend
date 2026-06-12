import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min, IsOptional } from 'class-validator';

export class CreateEvaluationDto {
  @ApiProperty({ example: 'جيد جداً', description: 'Evaluation title' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 10,
    description: 'Points awarded for this evaluation',
  })
  @IsInt()
  points: number;

  @ApiProperty({
    example: 90,
    description: 'Minimum marks required to pass (score >= minimum_marks = pass)',
  })
  @IsInt()
  @Min(0)
  minimum_marks: number;

  @ApiProperty({
    example: true,
    description: 'Whether this evaluation is considered a passing grade',
  })
  @IsOptional()
  is_passed?: boolean;

  @ApiProperty({
    example: 1,
    description: 'Campaign ID this evaluation belongs to',
  })
  @IsInt()
  campaign_id: number;
}

export class UpdateEvaluationDto {
  @ApiProperty({ example: 1, description: 'Evaluation ID' })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({ example: 'جيد جداً', description: 'Evaluation title' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 10,
    description: 'Points awarded for this evaluation',
  })
  @IsInt()
  points: number;

  @ApiProperty({
    example: 90,
    description: 'Minimum marks required to pass',
  })
  @IsInt()
  @Min(0)
  minimum_marks: number;

  @ApiProperty({
    example: true,
    description: 'Whether this evaluation is considered a passing grade',
  })
  @IsOptional()
  is_passed?: boolean;
}

export class EvaluationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  points: number;

  @ApiProperty()
  minimum_marks: number;

  @ApiProperty({ example: true })
  is_passed: boolean;

  @ApiProperty()
  campaign_id: number;

  @ApiProperty({
    description: 'Whether this evaluation is used in any sessions',
  })
  is_related: boolean;

  @ApiProperty({
    description: 'Number of saving sessions using this evaluation',
    required: false,
  })
  sessions_count?: number;

  @ApiProperty({
    description: 'Number of session portions using this evaluation',
    required: false,
  })
  session_portions_count?: number;
}

export class AssertEvaluationsDto {
  @ApiProperty({ example: 1, description: 'Campaign ID' })
  @IsInt()
  campaignId: number;

  @ApiProperty({
    type: [UpdateEvaluationDto],
    description: 'List of evaluations to sync',
  })
  evaluations: UpdateEvaluationDto[];
}
