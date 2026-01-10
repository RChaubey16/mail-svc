import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface TemplateSchema {
  required?: string[];
}

@Injectable()
export class TemplatesService {
  private readonly templatesRoot = path.join(process.cwd(), 'email-templates');

  /**
   * Validates the template and its variables.
   * @param template The name of the template.
   * @param version The version of the template.
   * @param variables The variables to validate.
   * @returns true if the template is valid.
   */
  validate(template: string, version = 'v1', variables: Record<string, any>) {
    const templatePath = path.join(this.templatesRoot, template, version);
    const templateFile = path.join(templatePath, 'template.mjml');

    if (!fs.existsSync(templateFile)) {
      throw new BadRequestException(
        `Template file missing for "${template}" (${version})`,
      );
    }

    const schemaPath = path.join(templatePath, 'schema.json');

    if (!fs.existsSync(schemaPath)) {
      throw new BadRequestException(
        `Schema missing for template "${template}" (${version})`,
      );
    }

    const schema = JSON.parse(
      fs.readFileSync(schemaPath, 'utf-8'),
    ) as TemplateSchema;

    const required: string[] = schema.required || [];

    const missing = required.filter((key) => !(key in variables));

    if (missing.length > 0) {
      throw new BadRequestException({
        error: 'TEMPLATE_VARIABLES_MISSING',
        missing,
      });
    }

    return true;
  }
}
