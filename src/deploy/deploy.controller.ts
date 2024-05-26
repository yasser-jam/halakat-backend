import { Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { exec } from 'child_process';

@Controller('deploy')
export class DeployController {
  @Post()
  async handlePostDeploy(@Res() res: Response) {
    exec('npm run db:push', (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: stderr });
      }
      return res.status(200).json({ message: stdout });
    });
  }
}
