import { ApiProperty } from '@nestjs/swagger';
import { LogEvent } from '@prisma/client';

export class CreateLogDto {
  @ApiProperty({ 
    enum: LogEvent,
    example: LogEvent.TEACHER_LOGIN,
    description: 'The type of log event'
  })
  event: LogEvent;

  @ApiProperty({ 
    example: 1, 
    required: false,
    description: 'ID of the teacher associated with this log'
  })
  teacher_id?: number;

  @ApiProperty({ 
    example: 1, 
    required: false,
    description: 'ID of the student associated with this log'
  })
  student_id?: number;

  @ApiProperty({ 
    example: 1, 
    required: false,
    description: 'ID of the group associated with this log'
  })
  group_id?: number;

  @ApiProperty({ 
    example: 'Additional notes about this log entry',
    required: false,
    description: 'Optional notes for this log entry'
  })
  notes?: string;

  @ApiProperty({
    type: 'object',
    required: false,
    example: { ip_address: '192.168.1.1', user_agent: 'Mozilla/5.0...' },
    description: 'Additional metadata for this log entry'
  })
  metadata?: any;
}

export class DeleteLogDto {
  @ApiProperty({ 
    example: 1,
    description: 'ID of the log entry to delete'
  })
  id: number;
}
