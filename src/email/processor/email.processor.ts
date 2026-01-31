import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import * as nodemailer from 'nodemailer';
import { TemplatesService } from '../../templates/templates.service';

interface emailDataSchema {
  template: string;
  version: string;
  to: string;
  subject: string;
  variables: Record<string, unknown>;
}

@Processor('email')
export class EmailProcessor extends WorkerHost {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly config: ConfigService,
    private readonly templatesService: TemplatesService,
  ) {
    super();
  }

  onModuleInit() {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST'),
      port: Number(this.config.get<number>('SMTP_PORT')),
      secure: this.config.get<string>('SMTP_SECURE') === 'true',
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
    });
  }

  async process(job: Job) {
    const { template, to, version, variables, subject }: emailDataSchema =
      job.data as emailDataSchema;

    console.log(`Processing email ${template} for`, to);

    // 1. Load MJML
    const html = this.templatesService.render(template, version ?? 'v1', {
      ...variables,
      year: new Date().getFullYear(),
    });

    // 3. Send email
    await this.sendMail({ to, subject, html });
  }

  async sendMail(options: {
    to: string | string[];
    subject: string;
    html: string;
  }): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.get<string>('SMTP_FROM'),
      to: Array.isArray(options.to) ? options.to.join(',') : options.to,
      subject: options.subject,
      html: options.html,
    });
  }
}
