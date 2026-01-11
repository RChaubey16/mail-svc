import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
