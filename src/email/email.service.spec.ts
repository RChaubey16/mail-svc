import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { BadRequestException } from '@nestjs/common';
import { EmailService } from './email.service';
import { TemplatesService } from '../templates/templates.service';
import { SendEmailDto } from './email.dto';

describe('EmailService', () => {
  let service: EmailService;

  const mockTemplatesService = {
    validate: jest.fn(),
  };

  const mockQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: TemplatesService,
          useValue: mockTemplatesService,
        },
        {
          provide: getQueueToken('email'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('enqueue', () => {
    const dto: SendEmailDto = {
      template: 'test-template',
      version: 'v1',
      to: ['test@example.com'],
      variables: { name: 'Test' },
    };

    it('should successfully enqueue an email', async () => {
      mockTemplatesService.validate.mockReturnValue(true);
      mockQueue.add.mockResolvedValue({ id: 'job-123' });

      const result = await service.enqueue(dto);

      expect(mockTemplatesService.validate).toHaveBeenCalledWith(
        dto.template,
        dto.version,
        dto.variables,
      );
      expect(mockQueue.add).toHaveBeenCalledWith('send-email', dto);
      expect(result).toEqual({
        messageId: 'job-123',
        status: 'queued',
      });
    });

    it('should throw if validation fails', async () => {
      const error = new BadRequestException('Validation failed');
      mockTemplatesService.validate.mockImplementation(() => {
        throw error;
      });

      await expect(service.enqueue(dto)).rejects.toThrow(error);
      expect(mockQueue.add).not.toHaveBeenCalled();
    });

    it('should throw if queue.add fails', async () => {
      mockTemplatesService.validate.mockReturnValue(true);
      const error = new Error('Queue error');
      mockQueue.add.mockRejectedValue(error);

      await expect(service.enqueue(dto)).rejects.toThrow(error);
    });
  });
});
