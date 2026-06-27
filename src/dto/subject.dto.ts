import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsInt()
  organization_id?: number;
}

export class UpdateSubjectDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsInt()
  organization_id?: number;
}

export class SubjectResponseDto {
  id: number;
  title: string;
  organization_id?: number;
  created_at: Date;
  updated_at: Date;
}
