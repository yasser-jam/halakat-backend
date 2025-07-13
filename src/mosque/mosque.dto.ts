import { ApiProperty } from '@nestjs/swagger';

export class CreateMosqueDto {
  @ApiProperty({ example: 'Al Noor Mosque' })
  name: string;

  @ApiProperty({ example: 'Downtown', required: false })
  city?: string;

  @ApiProperty({ example: 'Central Area', required: false })
  address_area?: string;

  @ApiProperty({ example: 'Near the park', required: false })
  address_details?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  contact_phone?: string;

  @ApiProperty({ example: 'info@alnoor.org', required: false })
  contact_email?: string;

  @ApiProperty({ example: true, required: false })
  is_active?: boolean;

  @ApiProperty({ example: 1 })
  organization_id: number;

  @ApiProperty({
    type: 'object',
    required: false,
    example: { established: 1990, capacity: 500 },
  })
  metadata?: any;
}
