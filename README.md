# Mail Service (mail-svc)

A robust, asynchronous email notification service built with **NestJS**, **BullMQ**, and **MJML**. This service provides a centralized way to manage and send system emails using templates with version control and schema validation.

## 🚀 Key Features

- **Asynchronous Processing**: Uses BullMQ and Redis for reliable, background email processing.
- **MJML Templates**: Support for responsive MJML email templates.
- **Template Versioning**: Manage multiple versions (e.g., `v1`, `v2`) of the same email template.
- **Schema Validation**: Built-in validation of template variables using JSON schema.
- **Template Explorer**: A visual interface to browse available templates and their required variables.
- **Health Monitoring**: Integrated health checks for the service.

## 🛠 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Queue System**: [BullMQ](https://docs.bullmq.io/)
- **Data Store**: [Redis](https://redis.io/)
- **Email Rendering**: [MJML](https://mjml.io/) & [Handlebars](https://handlebarsjs.com/)
- **Mailing**: [Nodemailer](https://nodemailer.com/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## 🏗 Architecture

1. **API Layer**: Receives email requests via REST endpoints.
2. **Validation**: Validates template existence and required variables.
3. **Queue**: Enqueues the email job into Redis using BullMQ.
4. **Worker**: A background processor picks up the job.
5. **Rendering**: Renders MJML with Handlebars variables into HTML.
6. **Delivery**: Sends the final HTML via SMTP using Nodemailer.

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- Redis server running locally or accessible via network.
- pnpm installed (`npm install -g pnpm`).

### Installation

```bash
$ pnpm install
```

### Configuration

Create a `.env` file in the root directory and configure the following variables:

```env
# SMTP Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-user
SMTP_PASS=your-password
SMTP_FROM="Mail Service <noreply@example.com>"

# Redis Configuration (BullMQ)
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Running the App

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## 📡 API Endpoints

### Notifications

- **List Templates**: `GET /notifications/templates`
  - Returns a visual HTML page exploring all available email templates and their schemas.
- **Send Email**: `POST /notifications/email`
  - Enqueues an email for sending.
  - **Body**:
    ```json
    {
      "to": "user@example.com",
      "subject": "Welcome!",
      "template": "welcome-email",
      "version": "v1",
      "variables": {
        "name": "John Doe"
      }
    }
    ```

### Health

- **Check Status**: `GET /health`
  - Returns `OK` if the service is running.

## 📂 Template Management

Templates are stored in the `email-templates/` directory. Each template should have the following structure:

```text
email-templates/
└── [template-name]/
    └── [version]/
        ├── template.mjml  # The MJML template file
        └── schema.json    # JSON schema defining required variables
```

### Example `schema.json`:
```json
{
  "required": ["name", "action_url"]
}
```

## 🧪 Testing

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## 📜 License

This project is [UNLICENSED](LICENSE).
