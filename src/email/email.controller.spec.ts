import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { SendEmailDto } from './email.dto';

describe('EmailController', () => {
  let controller: EmailController;

  const mockEmailService = {
    enqueue: jest.fn().mockResolvedValue({
      messageId: '123',
      status: 'queued',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    controller = module.get<EmailController>(EmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should send an email', async () => {
    const dto: SendEmailDto = {
      template: 'test',
      version: 'v1',
      to: ['test@example.com'],
      variables: {
        name: 'John Doe',
      },
    };

    const result = await controller.send(dto);

    expect(result).toEqual({
      messageId: '123',
      status: 'queued',
    });
    expect(mockEmailService.enqueue).toHaveBeenCalledWith(dto);
  });
});
