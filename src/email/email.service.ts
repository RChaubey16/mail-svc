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

  /**
   * Retrieves the status and data of a specific email job.
   * @param id The job ID.
   * @returns The job status and email data.
   */
  async getJobStatus(id: string) {
    const job = await this.emailQueue.getJob(id);

    if (!job) {
      return null;
    }

    const state = await job.getState();
    let status: 'queued' | 'processing' | 'completed' | 'failed' = 'queued';

    switch (state) {
      case 'completed':
        status = 'completed';
        break;
      case 'failed':
        status = 'failed';
        break;
      case 'active':
        status = 'processing';
        break;
      case 'waiting':
      case 'delayed':
      case 'waiting-children':
      case 'prioritized':
        status = 'queued';
        break;
    }

    return {
      id: job.id,
      status,
      emailData: job.data as SendEmailDto,
    };
  }
}
