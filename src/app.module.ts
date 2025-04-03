import { Module } from '@nestjs/common';
import { NatsModule } from './nats/nats.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [NatsModule, AuthModule],
})
export class AppModule {}
