import { Module } from '@nestjs/common';

import { NatsModule } from './nats/nats.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [NatsModule, AuthModule, ProductsModule],
})
export class AppModule {}
