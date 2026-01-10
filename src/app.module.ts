import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { TemplatesModule } from './templates/templates.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [EmailModule, TemplatesModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
