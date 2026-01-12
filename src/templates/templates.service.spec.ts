import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesService } from './templates.service';

describe('TemplatesService', () => {
  let service: TemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplatesService],
    }).compile();

    service = module.get<TemplatesService>(TemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    it('should validate invite-member template with correct variables', () => {
      const result = service.validate('invite-member', 'v1', {
        workspaceName: 'Test Workspace',
        inviteUrl: 'https://example.com/invite',
      });
      expect(result).toBe(true);
    });

    it('should throw BadRequestException for missing variables in invite-member template', () => {
      expect(() => {
        service.validate('invite-member', 'v1', {
          workspaceName: 'Test Workspace',
        });
      }).toThrow();
    });
  });
});
