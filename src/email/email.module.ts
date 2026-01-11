import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailProcessor } from './processor/email.processor';
import { TemplatesModule } from 'src/templates/templates.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [BullModule.registerQueue({ name: 'email' }), TemplatesModule],
  providers: [EmailService, EmailProcessor],
  exports: [EmailService],
})
export class EmailModule {}
