import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { catchError } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/auth/decorators';
import { CurrentUser } from 'src/auth/interfaces/current-user.interface';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Post()
  createProduct(
    @User() user: CurrentUser,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.client.send('CREATE_PRODUCT', {
      ...createProductDto,
      userId: user.id,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('GET_PRODUCTS_BY_USER', { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
