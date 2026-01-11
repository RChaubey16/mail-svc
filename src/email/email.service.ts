import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { TemplatesService } from '../templates/templates.service';
import { SendEmailDto } from './dto/email.dto';

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('email')
    private readonly emailQueue: Queue,
    private readonly templatesService: TemplatesService,
  ) {}

  /**
   * Enqueues an email job to be processed.
   * @param dto The email data transfer object containing the template, version, and variables.
   * @returns An object containing the message ID and status.
   */
  async enqueue(dto: SendEmailDto) {
    this.templatesService.validate(dto.template, dto.version, dto.variables);

    const job = await this.emailQueue.add('send-email', dto);

    return {
      messageId: job.id,
      status: 'queued',
    };
  }
}
