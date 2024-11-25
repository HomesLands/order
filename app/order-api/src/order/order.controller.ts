import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { Public } from 'src/auth/public.decorator';
import { ApiResponseWithType } from 'src/app/app.decorator';
import {
  CreateOrderRequestDto,
  GetOrderRequestDto,
  GetSpecificOrderRequestDto,
  OrderResponseDto,
} from './order.dto';
import { AppResponseDto } from 'src/app/app.dto';

@ApiTags('Order')
@Controller('orders')
@ApiBearerAuth()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Create a new order successfully',
    type: CreateOrderRequestDto,
  })
  @ApiOperation({ summary: 'Create new order' })
  @ApiResponse({ status: 200, description: 'Create new order successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createProduct(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    requestData: CreateOrderRequestDto,
  ) {
    const result = await this.orderService.createOrder(requestData);
    return {
      message: 'Order have been created successfully',
      statusCode: HttpStatus.CREATED,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<OrderResponseDto>;
  }

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all orders' })
  @ApiResponse({ status: 200, description: 'Get all orders successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'All orders have been retrieved successfully',
    type: OrderResponseDto,
    isArray: true,
  })
  async getAllOrders(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: GetOrderRequestDto,
  ) {
    const result = await this.orderService.getAllOrders(query);
    return {
      message: 'All orders have been retrieved successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<OrderResponseDto[]>;
  }

  @Get(':slug')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve order by slug' })
  @ApiResponse({ status: 200, description: 'Get order by slug successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Get order by slug successfully',
    type: OrderResponseDto,
  })
  @ApiParam({
    name: 'slug',
    description: 'The slug of the order to be retrieved',
    required: true,
    example: 'vKwq07TZM',
  })
  async getOrder(@Param('slug') slug: string) {
    const result = await this.orderService.getOrderBySlug(slug);
    return {
      message: 'Get specific order successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<OrderResponseDto>;
  }
}
