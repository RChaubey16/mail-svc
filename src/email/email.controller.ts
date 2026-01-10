import { Body, Controller, Post } from '@nestjs/common';
import { SendEmailDto } from './email.dto';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  send(@Body() dto: SendEmailDto) {
    return this.emailService.enqueue(dto);
  }
}
