import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherDto {
  @ApiProperty({ example: 'Bachelor', required: false })
  educational_level?: string;

  @ApiProperty({ example: 'University of Cairo', required: false })
  university_name?: string;

  @ApiProperty({ example: 'Faculty of Islamic Studies', required: false })
  college_name?: string;

  @ApiProperty({ example: 'Ahmed' })
  first_name?: string;

  @ApiProperty({ example: 'Mohammed' })
  last_name?: string;

  @ApiProperty({ example: '1985-03-15T00:00:00.000Z', required: false })
  birth_date?: Date;

  @ApiProperty({ example: '+1234567890' })
  mobile_phone_number: string;

  @ApiProperty({ example: false, required: false })
  in_another_mosque?: boolean;

  @ApiProperty({ example: 'Al-Rahman Mosque', required: false })
  other_mosque_names?: string;

  @ApiProperty({ example: 'Quran teaching', required: false })
  special_talent?: string;

  @ApiProperty({ example: 'Ali Mohammed', required: false })
  father_name?: string;

  @ApiProperty({ example: 'Downtown', required: false })
  current_residence_address_area?: string;

  @ApiProperty({ example: 'Main Street', required: false })
  current_residence_address_street?: string;

  @ApiProperty({ example: 'Building A', required: false })
  current_residence_address_building?: string;

  @ApiProperty({ example: 'Juz 1-5', required: false })
  preserved_parts?: any;

  @ApiProperty({ example: 'Juz 1-3', required: false })
  parts_tested_by_the_endowments?: any;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  image_url?: string;

  @ApiProperty({ example: true, required: false })
  is_mojaz?: boolean;

  @ApiProperty({ example: true, required: false })
  is_working?: boolean;

  @ApiProperty({ example: 'Quran Teacher', required: false })
  job_role?: string;

  @ApiProperty({ example: 'Al-Noor School', required: false })
  workplace_name?: string;

  @ApiProperty({ example: 'password123', required: false })
  password?: string;

  @ApiProperty({ example: 'TEACHER', required: false })
  role?: string;

  @ApiProperty({ example: 'Teacher notes', required: false })
  notes?: string;
}

export class AssignTeacherCampaignDto {
  @ApiProperty({ example: 1, description: 'Campaign ID to assign the teacher to' })
  campaign_id: number;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Role ID to assign (defaults to 1)',
  })
  role_id?: number;
}
