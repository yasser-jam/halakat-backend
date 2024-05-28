import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignDto {
  @ApiProperty({ required: false })
  @IsString()
  name: string;
}

export class UpdateCampaignDto extends CreateCampaignDto {}

export class ValidateCampaginIdDto {
  @ApiProperty()
  @IsInt()
  id: number;
}
