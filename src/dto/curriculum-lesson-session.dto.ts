import { IsString, IsOptional, IsInt, IsBoolean, IsDateString } from 'class-validator';

export class CreateCurriculumLessonSessionDto {
  @IsInt()
  node_id: number;

  @IsInt()
  group_id: number;

  @IsInt()
  teacher_id: number;

  @IsInt()
  campaign_id: number;

  @IsInt()
  session_number: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsBoolean()
  is_finished?: boolean;

  @IsOptional()
  @IsInt()
  duration_minutes?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateCurriculumLessonSessionDto {
  @IsOptional()
  @IsInt()
  node_id?: number;

  @IsOptional()
  @IsInt()
  group_id?: number;

  @IsOptional()
  @IsInt()
  teacher_id?: number;

  @IsOptional()
  @IsInt()
  campaign_id?: number;

  @IsOptional()
  @IsInt()
  session_number?: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsBoolean()
  is_finished?: boolean;

  @IsOptional()
  @IsInt()
  duration_minutes?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CurriculumLessonSessionResponseDto {
  id: number;
  node_id: number;
  group_id: number;
  teacher_id: number;
  campaign_id: number;
  session_number: number;
  date?: Date;
  is_finished: boolean;
  duration_minutes?: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  lesson_node?: {
    id: number;
    name: string;
    description?: string;
    node_type?: string;
    status: string;
  };
  group?: {
    id: number;
    title: string;
  };
  teacher?: {
    id: number;
    first_name?: string;
    last_name?: string;
  };
  campaign?: {
    id: number;
    name: string;
  };
}
