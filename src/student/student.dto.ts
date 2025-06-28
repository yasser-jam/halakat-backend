import { ApiProperty } from '@nestjs/swagger';

// Import the enums from the dto file
import { Status, MaritalStatus } from '../dto/student.dto';

export class CreateStudentDto {
  @ApiProperty({ example: 'Al Noor Mosque', required: false })
  current_mosque_name?: string;

  @ApiProperty({ example: 5, required: false })
  educational_class?: number;

  @ApiProperty({ example: 'Ahmed' })
  first_name?: string;

  @ApiProperty({ example: 'Mohammed' })
  last_name?: string;

  @ApiProperty({ example: '2010-05-15T00:00:00.000Z', required: false })
  birth_date?: Date;

  @ApiProperty({ example: '+1234567890' })
  student_mobile: string;

  @ApiProperty({ example: 'Al-Noor School', required: false })
  school?: string;

  @ApiProperty({ example: false, required: false })
  in_another_mosque?: boolean;

  @ApiProperty({ example: 'Al-Rahman Mosque', required: false })
  other_mosque_names?: string;

  @ApiProperty({ example: 'Healthy', required: false })
  student_health_status?: string;

  @ApiProperty({ example: 'Quran memorization', required: false })
  special_talent?: string;

  @ApiProperty({ example: 'Ali Mohammed', required: false })
  father_name?: string;

  @ApiProperty({ example: Status.ALIVE, enum: Status, required: false })
  father_status?: Status;

  @ApiProperty({ example: 'Engineer', required: false })
  father_job?: string;

  @ApiProperty({ example: 'High', required: false })
  father_income_level?: string;

  @ApiProperty({ example: 'University', required: false })
  father_education_level?: string;

  @ApiProperty({ example: 'Healthy', required: false })
  father_health_status?: string;

  @ApiProperty({ example: '+1234567891', required: false })
  father_phone_number?: string;

  @ApiProperty({ example: '+1234567892', required: false })
  father_work_number?: string;

  @ApiProperty({ example: 'Fatima Ali', required: false })
  mother_name?: string;

  @ApiProperty({ example: Status.ALIVE, enum: Status, required: false })
  mother_status?: Status;

  @ApiProperty({ example: 'Teacher', required: false })
  mother_job?: string;

  @ApiProperty({ example: 'Medium', required: false })
  mother_income_level?: string;

  @ApiProperty({ example: 'High School', required: false })
  mother_education_level?: string;

  @ApiProperty({ example: 'Healthy', required: false })
  mother_health_status?: string;

  @ApiProperty({ example: '+1234567893', required: false })
  mother_phone_number?: string;

  @ApiProperty({ example: '+1234567894', required: false })
  mother_home_number?: string;

  @ApiProperty({
    example: MaritalStatus.MARRIED,
    enum: MaritalStatus,
    required: false,
  })
  parent_marital_status?: MaritalStatus;

  @ApiProperty({ example: '+1234567895', required: false })
  student_mobile_number?: string;

  @ApiProperty({ example: '+1234567896', required: false })
  student_home_number?: string;

  @ApiProperty({ example: 'Downtown', required: false })
  original_residence_address_area?: string;

  @ApiProperty({ example: 'Main Street', required: false })
  original_residence_address_street?: string;

  @ApiProperty({ example: 'Building A', required: false })
  original_residence_address_building?: string;

  @ApiProperty({ example: '3rd Floor', required: false })
  original_residence_address_floor?: string;

  @ApiProperty({ example: 'Uptown', required: false })
  current_residence_address_area?: string;

  @ApiProperty({ example: 'Oak Street', required: false })
  current_residence_address_street?: string;

  @ApiProperty({ example: 'Building B', required: false })
  current_residence_address_building?: string;

  @ApiProperty({ example: '2nd Floor', required: false })
  current_residence_address_floor?: string;

  @ApiProperty({ example: 'Juz 1-5', required: false })
  preserved_parts?: string;

  @ApiProperty({ example: 'Juz 1-3', required: false })
  parts_tested_by_the_endowments?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  image_url?: string;

  @ApiProperty({ example: 'password123', required: false })
  password?: string;
}
