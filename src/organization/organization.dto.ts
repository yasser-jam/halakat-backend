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

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number of the organization owner',
    required: false,
  })
  owner_phone?: string;

  @ApiProperty({
    example: 'John',
    description: 'First name of the owner',
    required: false,
  })
  owner_first_name?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the owner',
    required: false,
  })
  owner_last_name?: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password for the owner account',
    required: false,
  })
  owner_password?: string;
}
