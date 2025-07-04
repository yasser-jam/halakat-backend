import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateEvaluationDto {
  @ApiProperty({ example: 'جيد جداً' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  points: number;

  @ApiProperty({
    example: 90,
    description: 'Max reduced points to get this evaluation',
  })
  @IsInt()
  @Min(0)
  minimum_marks: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  campaign_id: number;
}
