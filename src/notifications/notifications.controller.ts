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

  @Post('email')
  send(@Body() dto: SendEmailDto) {
    return this.emailService.enqueue(dto);
  }

  @Get('templates/:template/:version/preview')
  preview(
    @Param('template') template: string,
    @Param('version') version: string,
    @Query() variables: Record<string, string>,
  ) {
    return this.templatesService.render(template, version, variables);
  }

  @Get('templates-list')
  listTemplates() {
    const templates = this.templatesService.listTemplates();

    console.log(`TEMPLATES`, templates);

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Templates | Notifications service</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
        <style>
          :root {
            --bg-primary: #0a0b0e;
            --bg-secondary: #12131a;
            --card-bg: rgba(25, 26, 35, 0.6);
            --card-border: rgba(255, 255, 255, 0.06);
            --primary: #6366f1;
            --primary-hover: #5558e3;
            --primary-light: #818cf8;
            --accent: #8b5cf6;
            --text-primary: #f1f5f9;
            --text-secondary: #cbd5e1;
            --text-muted: #94a3b8;
            --text-subtle: #64748b;
            --success: #10b981;
            --border-radius-sm: 8px;
            --border-radius-md: 12px;
            --border-radius-lg: 16px;
            --border-radius-xl: 20px;
            --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
            --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.15);
            --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.2);
            --shadow-glow: 0 0 40px rgba(99, 102, 241, 0.15);
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            background: var(--bg-primary);
            color: var(--text-primary);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            min-height: 100vh;
            padding: 3rem 1.5rem;
            position: relative;
            overflow-x: hidden;
          }

          body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
              radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 85% 85%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.03) 0%, transparent 100%);
            pointer-events: none;
            z-index: 0;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
          }

          /* Header Styles */
          header {
            margin-bottom: 3.5rem;
            text-align: center;
          }

          .header-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
            border: 1px solid rgba(99, 102, 241, 0.2);
            border-radius: 100px;
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--primary-light);
            margin-bottom: 1.5rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }

          .header-badge::before {
            content: '';
            width: 6px;
            height: 6px;
            background: var(--success);
            border-radius: 50%;
            box-shadow: 0 0 8px var(--success);
            animation: pulse 2s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(0.9); }
          }

          h1 {
            font-family: 'Outfit', sans-serif;
            font-size: clamp(2.5rem, 5vw, 3.5rem);
            font-weight: 700;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.03em;
            line-height: 1.1;
          }

          .subtitle {
            color: var(--text-muted);
            font-size: 1.1rem;
            font-weight: 400;
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.6;
          }

          /* Templates Grid */
          .templates-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
            gap: 1.75rem;
            margin-bottom: 2rem;
          }

          @media (max-width: 768px) {
            .templates-grid {
              grid-template-columns: 1fr;
            }
          }

          /* Template Card */
          .template-card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: var(--border-radius-xl);
            padding: 2rem;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }

          .template-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, 
              transparent, 
              var(--primary) 20%, 
              var(--accent) 80%, 
              transparent
            );
            opacity: 0;
            transition: opacity 0.4s;
          }

          .template-card:hover {
            transform: translateY(-6px);
            border-color: rgba(99, 102, 241, 0.3);
            background: rgba(30, 31, 42, 0.7);
            box-shadow: var(--shadow-glow);
          }

          .template-card:hover::before {
            opacity: 1;
          }

          /* Template Header */
          .template-header {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            margin-bottom: 1.75rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--card-border);
          }

          .template-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
            border: 1px solid rgba(99, 102, 241, 0.2);
            border-radius: var(--border-radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: all 0.3s ease;
          }

          .template-card:hover .template-icon {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.25));
            transform: scale(1.05);
          }

          .template-icon svg {
            width: 24px;
            height: 24px;
            stroke: var(--primary-light);
          }

          .template-info {
            flex: 1;
            min-width: 0;
          }

          .template-name {
            font-family: 'Outfit', sans-serif;
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.35rem;
            color: var(--text-primary);
            letter-spacing: -0.01em;
            word-wrap: break-word;
            line-height: 1.3;
          }

          .template-id {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.8rem;
            color: var(--text-subtle);
            word-wrap: break-word;
          }

          /* Version Section */
          .version-item {
            margin-bottom: 1.5rem;
          }

          .version-item:last-child {
            margin-bottom: 0;
          }

          .version-tag {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            padding: 0.4rem 0.9rem;
            background: rgba(99, 102, 241, 0.1);
            border: 1px solid rgba(99, 102, 241, 0.25);
            color: var(--primary-light);
            border-radius: 100px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-bottom: 1rem;
          }

          .version-tag::before {
            content: '';
            width: 5px;
            height: 5px;
            background: var(--primary-light);
            border-radius: 50%;
          }

          /* Variables Section */
          .variables-section {
            margin-top: 0.5rem;
          }

          .variables-title {
            font-size: 0.75rem;
            color: var(--text-subtle);
            margin-bottom: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            font-weight: 600;
          }

          .variable-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .variable-chip {
            padding: 0.45rem 0.85rem;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid var(--card-border);
            border-radius: var(--border-radius-sm);
            font-size: 0.8rem;
            color: var(--text-secondary);
            font-family: 'JetBrains Mono', monospace;
            transition: all 0.2s ease;
            white-space: nowrap;
          }

          .variable-chip:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(99, 102, 241, 0.3);
            color: var(--text-primary);
          }

          .no-variables {
            font-size: 0.85rem;
            color: var(--text-subtle);
            font-style: italic;
          }

          /* Preview Button */
          .preview-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.6rem;
            padding: 0.75rem 1.5rem;
            background: var(--primary);
            color: white;
            border-radius: var(--border-radius-md);
            font-size: 0.9rem;
            font-weight: 600;
            text-decoration: none;
            margin-top: 1.25rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
            width: 100%;
          }

          .preview-btn:hover {
            background: var(--primary-hover);
            transform: translateY(-2px);
            box-shadow: 0 6px 24px rgba(99, 102, 241, 0.4);
          }

          .preview-btn:active {
            transform: translateY(0);
          }

          .preview-btn svg {
            width: 18px;
            height: 18px;
          }

          /* Empty State */
          .empty-state {
            text-align: center;
            padding: 5rem 2rem;
            background: var(--card-bg);
            border-radius: var(--border-radius-xl);
            border: 2px dashed var(--card-border);
            backdrop-filter: blur(20px);
            grid-column: 1 / -1;
          }

          .empty-state-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem;
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .empty-state-icon svg {
            width: 40px;
            height: 40px;
            stroke: var(--text-subtle);
          }

          .empty-state h3 {
            font-family: 'Outfit', sans-serif;
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: var(--text-secondary);
          }

          .empty-state p {
            color: var(--text-muted);
            font-size: 1rem;
          }

          /* Responsive adjustments */
          @media (max-width: 640px) {
            body {
              padding: 2rem 1rem;
            }

            header {
              margin-bottom: 2.5rem;
            }

            .template-card {
              padding: 1.5rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div class="header-badge">
              <span>Notifications Service</span>
            </div>
            <h1>Mail Templates</h1>
            <p class="subtitle">Manage and preview your system email notification templates</p>
          </header>

          <div class="templates-grid">
            ${
              templates.length > 0
                ? templates
                    .map(
                      (t) => `
              <div class="template-card">
                <div class="template-header">
                  <div class="template-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                      <path d="m3 7 9 6 9-6"></path>
                    </svg>
                  </div>
                  <div class="template-info">
                    <div class="template-name">${t.name.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</div>
                    <div class="template-id">${t.name}</div>
                  </div>
                </div>
                ${t.versions
                  .map(
                    (v) => `
                  <div class="version-item">
                    <span class="version-tag">${v.version}</span>
                    <div class="variables-section">
                      <div class="variables-title">Required Variables</div>
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
                            : '<span class="no-variables">No required variables</span>';
                        })()}
                      </div>
                    </div>
                    <a href="/notifications/templates/${t.name}/${v.version}/preview" target="_blank" class="preview-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      Preview Template
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
                <div class="empty-state-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                  </svg>
                </div>
                <h3>No Templates Found</h3>
                <p>There are no email templates in the directory yet.</p>
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

  @Get(':id')
  async getStatus(@Param('id') id: string) {
    const jobStatus = await this.emailService.getJobStatus(id);

    if (!jobStatus) {
      throw new NotFoundException(`Notification job with ID ${id} not found`);
    }

    return jobStatus;
  }
}
