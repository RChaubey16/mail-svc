import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { EmailService } from '../email/email.service';
import { TemplatesService } from '../templates/templates.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: EmailService,
          useValue: {
            enqueue: jest.fn(),
            getJobStatus: jest.fn(),
          },
        },
        {
          provide: TemplatesService,
          useValue: {
            listTemplates: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
