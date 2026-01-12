import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { EmailModule } from 'src/email/email.module';
import { TemplatesModule } from 'src/templates/templates.module';

@Module({
  imports: [EmailModule, TemplatesModule],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
