import { ApiProperty } from '@nestjs/swagger';

// DTO for creating/updating Organization
export class CreateOrganizationDto {
  @ApiProperty({ example: 'Al Noor Mosque' })
  name: string;

  @ApiProperty({
    example: 'A large mosque in the city center',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: 'info@alnoor.org', required: false })
  contact_email?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  contact_phone?: string;

  @ApiProperty({ example: '123 Main St, City', required: false })
  address?: string;

  @ApiProperty({ example: true, required: false })
  is_active?: boolean;

  @ApiProperty({
    type: 'object',
    required: false,
    example: { established: 1990, capacity: 500 },
  })
  metadata?: any;
}
