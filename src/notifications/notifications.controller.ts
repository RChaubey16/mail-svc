import { Body, Controller, Post } from '@nestjs/common';
import { SendEmailDto } from 'src/email/dto/email.dto';
import { EmailService } from 'src/email/email.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly emailService: EmailService) {}

  @Post('email')
  send(@Body() dto: SendEmailDto) {
    return this.emailService.enqueue(dto);
  }
}
