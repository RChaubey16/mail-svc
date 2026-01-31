import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { SendEmailDto } from '../email/dto/email.dto';
import { EmailService } from '../email/email.service';
import { TemplatesService } from '../templates/templates.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly emailService: EmailService,
    private readonly templatesService: TemplatesService,
  ) {}

  @Get('templates')
  listTemplates() {
    const templates = this.templatesService.listTemplates();

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Templates | Mail-Svc</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
          :root {
            --bg-color: #0c0d10;
            --card-bg: rgba(255, 255, 255, 0.03);
            --card-border: rgba(255, 255, 255, 0.08);
            --primary: #6366f1;
            --primary-glow: rgba(99, 102, 241, 0.4);
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --glass-blur: blur(12px);
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            background-color: var(--bg-color);
            color: var(--text-main);
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            padding: 4rem 2rem;
            background-image: 
              radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 40%);
          }

          .container {
            max-width: 1000px;
            margin: 0 auto;
          }

          header {
            margin-bottom: 4rem;
            text-align: center;
          }

          h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 3rem;
            font-weight: 600;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.02em;
          }

          .subtitle {
            color: var(--text-muted);
            font-size: 1.1rem;
          }

          .templates-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 2rem;
          }

          .template-card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 20px;
            padding: 2rem;
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }

          .template-card:hover {
            transform: translateY(-8px);
            border-color: var(--primary);
            box-shadow: 0 12px 40px -12px var(--primary-glow);
          }

          .template-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--primary), transparent);
            transform: translateX(-100%);
            transition: transform 0.6s;
          }

          .template-card:hover::before {
            transform: translateX(100%);
          }

          .template-name {
            font-family: 'Outfit', sans-serif;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .template-name::before {
            content: '';
            width: 8px;
            height: 8px;
            background: var(--primary);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--primary);
          }

          .version-tag {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            background: rgba(99, 102, 241, 0.1);
            border: 1px solid rgba(99, 102, 241, 0.2);
            color: #818cf8;
            border-radius: 100px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 1rem;
          }

          .variables-section {
            margin-top: 1.5rem;
          }

          .variables-title {
            font-size: 0.85rem;
            color: var(--text-muted);
            margin-bottom: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
          }

          .variable-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

            .variable-chip {
              padding: 0.4rem 0.8rem;
              background: rgba(255, 255, 255, 0.03);
              border: 1px solid var(--card-border);
              border-radius: 8px;
              font-size: 0.85rem;
              color: var(--text-main);
              font-family: 'JetBrains Mono', monospace;
            }

            .preview-btn {
              display: inline-flex;
              align-items: center;
              padding: 0.6rem 1.2rem;
              background: var(--primary);
              color: white;
              border-radius: 12px;
              font-size: 0.9rem;
              font-weight: 600;
              text-decoration: none;
              margin-top: 1.5rem;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px var(--primary-glow);
            }

            .preview-btn:hover {
              transform: scale(1.05);
              box-shadow: 0 6px 20px var(--primary-glow);
              background: #4f46e5;
            }

            .preview-btn svg {
              margin-right: 0.5rem;
            }

          .empty-state {
            text-align: center;
            padding: 4rem;
            color: var(--text-muted);
            background: var(--card-bg);
            border-radius: 20px;
            border: 1px dashed var(--card-border);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>Mail Service Templates</h1>
            <p class="subtitle">Explore and manage your system email notifications</p>
          </header>

          <div class="templates-grid">
            ${
              templates.length > 0
                ? templates
                    .map(
                      (t) => `
              <div class="template-card">
                <div class="template-name">${t.name.replace(/-/g, ' ')} / ${t.name}</div>
                ${t.versions
                  .map(
                    (v) => `
                  <div class="version-item">
                    <span class="version-tag">${v.version}</span>
                      <div class="variable-list">
                        ${(() => {
                          const required = v.schema.required || [];
                          return required.length > 0
                            ? required
                                .map(
                                  (req) => `
                          <span class="variable-chip">${req}</span>
                        `,
                                )
                                .join('')
                            : '<span class="subtitle" style="font-size: 0.85rem">No required variables</span>';
                        })()}
                      </div>
                    </div>
                    <a href="/notifications/templates/${t.name}/${v.version}/preview" target="_blank" class="preview-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      Preview
                    </a>
                  </div>
                `,
                  )
                  .join('')}
              </div>
            `,
                    )
                    .join('')
                : `
              <div class="empty-state">
                <p>No templates found in the email-templates directory.</p>
              </div>
            `
            }
          </div>
        </div>
      </body>
      </html>
    `;

    return html;
  }

  @Get('templates/:template/:version/preview')
  preview(
    @Param('template') template: string,
    @Param('version') version: string,
    @Query() variables: Record<string, string>,
  ) {
    return this.templatesService.render(template, version, variables);
  }

  @Post('email')
  send(@Body() dto: SendEmailDto) {
    return this.emailService.enqueue(dto);
  }

  @Get(':id')
  async getStatus(@Param('id') id: string) {
    const jobStatus = await this.emailService.getJobStatus(id);

    if (!jobStatus) {
      throw new NotFoundException(`Notification job with ID ${id} not found`);
    }

    return jobStatus;
  }
}
