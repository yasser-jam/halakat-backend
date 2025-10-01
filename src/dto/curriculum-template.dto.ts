import { IsString, IsOptional, IsInt, IsArray, IsEnum, IsBoolean, IsDateString } from 'class-validator';

// Enum for NodeStatus
export enum NodeStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  LATE = 'LATE',
  SKIPPED = 'SKIPPED',
  CANCELLED = 'CANCELLED',
}

// CurriculumTemplate DTOs
export class CreateCurriculumTemplateDto {
  @IsInt()
  curriculum_id: number;

  @IsInt()
  campaign_id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateCurriculumTemplateDto {
  @IsOptional()
  @IsInt()
  curriculum_id?: number;

  @IsOptional()
  @IsInt()
  campaign_id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CurriculumTemplateResponseDto {
  id: number;
  curriculum_id: number;
  campaign_id: number;
  name?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  curriculum?: {
    id: number;
    name: string;
    description?: string;
  };
  campaign?: {
    id: number;
    name: string;
  };
  nodes?: CurriculumTemplateNodeResponseDto[];
}

// CurriculumTemplateNode DTOs
export class CreateCurriculumTemplateNodeDto {
  @IsInt()
  template_id: number;

  @IsOptional()
  @IsInt()
  parent_id?: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  node_type?: string;

  @IsInt()
  order_index: number;

  @IsOptional()
  @IsInt()
  estimated_lessons_count?: number;

  @IsOptional()
  @IsInt()
  estimated_duration_minutes?: number;

  @IsOptional()
  @IsInt()
  lesson_span?: number;

  @IsOptional()
  @IsEnum(NodeStatus)
  status?: NodeStatus;
}

export class UpdateCurriculumTemplateNodeDto {
  @IsOptional()
  @IsInt()
  template_id?: number;

  @IsOptional()
  @IsInt()
  parent_id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  node_type?: string;

  @IsOptional()
  @IsInt()
  order_index?: number;

  @IsOptional()
  @IsInt()
  estimated_lessons_count?: number;

  @IsOptional()
  @IsInt()
  estimated_duration_minutes?: number;

  @IsOptional()
  @IsInt()
  lesson_span?: number;

  @IsOptional()
  @IsEnum(NodeStatus)
  status?: NodeStatus;
}

export class CurriculumTemplateNodeResponseDto {
  id: number;
  template_id: number;
  parent_id?: number;
  name: string;
  description?: string;
  node_type?: string;
  order_index: number;
  estimated_lessons_count?: number;
  estimated_duration_minutes?: number;
  lesson_span?: number;
  status: NodeStatus;
  created_at: Date;
  updated_at: Date;
  children?: CurriculumTemplateNodeResponseDto[];
  parent?: CurriculumTemplateNodeResponseDto;
}
