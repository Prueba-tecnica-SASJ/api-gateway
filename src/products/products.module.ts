import { Module } from '@nestjs/common';

import { ProductsController } from './products.controller';
import { NatsModule } from 'src/nats/nats.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [ProductsController],
  providers: [AuthService],
  imports: [NatsModule],
})
export class ProductsModule {}
