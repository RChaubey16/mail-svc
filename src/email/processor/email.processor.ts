import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import Handlebars from 'handlebars';
import mjml2html from 'mjml';
import * as fs from 'fs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';

interface emailDataSchema {
  template: string;
  version: string;
  to: string;
  variables: Record<string, unknown>;
}

@Processor('email')
export class EmailProcessor extends WorkerHost {
  private transporter: nodemailer.Transporter;
  private readonly templatesRoot = path.join(process.cwd(), 'email-templates');

  constructor(private readonly config: ConfigService) {
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
    const { template, to, version, variables }: emailDataSchema =
      job.data as emailDataSchema;

    console.log(`Processing email ${template} for`, to);

    // 1. Load MJML
    const html = this.renderTemplate(template, version ?? 'v1', {
      ...variables,
      year: new Date().getFullYear(),
    });

    // 3. Send email
    await this.sendMail({ to, subject: 'Welcome aboard!', html });
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

  private renderTemplate(
    templateName: string,
    version: string,
    data: Record<string, any>,
  ): string {
    // 1. Load MJML file
    const templatePath = path.join(this.templatesRoot, templateName, version);
    const templateFile = path.join(templatePath, `template.mjml`);

    if (!fs.existsSync(templateFile)) {
      throw new Error(`Email template not found: ${templatePath}`);
    }

    const mjmlTemplate = fs.readFileSync(templateFile, 'utf8');

    // 2. Render with Handlebars
    const compiled = Handlebars.compile(mjmlTemplate);
    const mjmlWithData = compiled(data);

    // 3. Convert MJML → HTML
    const { html, errors } = mjml2html(mjmlWithData, {
      validationLevel: 'strict',
    });

    if (errors?.length) {
      throw new Error(`MJML render error: ${JSON.stringify(errors)}`);
    }

    return html;
  }
}
