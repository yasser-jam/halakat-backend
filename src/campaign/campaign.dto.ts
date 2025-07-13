import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignDto {
  @ApiProperty({ example: 1 })
  mosque_id: number;

  @ApiProperty({ example: 'Summer Quran Program' })
  name: string;

  @ApiProperty({ example: '2024-06-15T08:00:00.000Z', required: false })
  start_date?: Date;

  @ApiProperty({ example: '2024-08-15T08:00:00.000Z', required: false })
  end_date?: Date;

  @ApiProperty({ example: '2024-06-10T08:00:00.000Z', required: false })
  assign_start_date?: Date;

  @ApiProperty({ example: '2024-06-14T08:00:00.000Z', required: false })
  assign_end_date?: Date;

  @ApiProperty({ example: false, required: false })
  is_campaign_continuous?: boolean;

  @ApiProperty({ example: false, required: false })
  limited_students_count?: boolean;

  @ApiProperty({ example: 30, required: false })
  students_count?: number;

  @ApiProperty({ example: false, required: false })
  assign_by_link?: boolean;

  @ApiProperty({ example: 'UNLIMIT_ASSIGN', required: false })
  complete_count_approach?: string;

  @ApiProperty({ example: 'Sat,Sun,Mon', required: false })
  days?: string;

  @ApiProperty({ example: 'hours', required: false })
  timing_approach?: string;

  @ApiProperty({ example: '08:00', required: false })
  start_time?: string;

  @ApiProperty({ example: '12:00', required: false })
  end_time?: string;

  @ApiProperty({ example: false, required: false })
  status?: boolean;

  @ApiProperty({
    type: 'object',
    required: false,
    example: { notes: 'Special summer program', budget: 5000 },
  })
  metadata?: any;
}
