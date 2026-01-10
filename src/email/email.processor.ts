import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

interface emailDataSchema {
  template: string;
  version: string;
  to: string;
  variables: Record<string, unknown>;
}

@Processor('email')
export class EmailProcessor extends WorkerHost {
  async process(job: Job) {
    const { template, to }: emailDataSchema = job.data as emailDataSchema;

    console.log(`Processing email ${template} for`, to);

    // Next phase:
    // 1. Load MJML
    // 2. Render with Handlebars
    // 3. Send email
  }
}
