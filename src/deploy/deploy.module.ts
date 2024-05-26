import { Module } from '@nestjs/common';
import { DeployController } from './deploy.controller';

@Module({
  controllers: [DeployController],
})
export class DeployModule {}
