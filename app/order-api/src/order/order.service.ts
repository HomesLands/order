import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Between, DataSource, FindOptionsWhere, In, Repository } from 'typeorm';
import {
  CheckDataCreateOrderItemResponseDto,
  CreateOrderRequestDto,
  GetOrderRequestDto,
  OrderResponseDto,
} from './order.dto';
import { OrderItem } from 'src/order-item/order-item.entity';
import { CreateOrderItemRequestDto } from 'src/order-item/order-item.dto';
import { Table } from 'src/table/table.entity';
import { Branch } from 'src/branch/branch.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { User } from 'src/user/user.entity';
import { Variant } from 'src/variant/variant.entity';
import { OrderStatus, OrderType } from './order.contants';
import { WorkflowStatus } from 'src/tracking/tracking.constants';
import { RobotConnectorClient } from 'src/robot-connector/robot-connector.client';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderException } from './order.exception';
import { OrderValidation } from './order.validation';
import { BranchValidation } from 'src/branch/branch.validation';
import { TableException } from 'src/table/table.exception';
import { TableValidation } from 'src/table/table.validation';
import { VariantException } from 'src/variant/variant.exception';
import { VariantValidation } from 'src/variant/variant.validation';
import { Tracking } from 'src/tracking/tracking.entity';
import { PaymentAction, PaymentStatus } from 'src/payment/payment.constants';
import { BranchException } from 'src/branch/branch.exception';
import { AppPaginatedResponseDto } from 'src/app/app.dto';
import { Menu } from 'src/menu/menu.entity';
import { MenuValidation } from 'src/menu/menu.validation';
import { MenuException } from 'src/menu/menu.exception';
import { MenuItem } from 'src/menu-item/menu-item.entity';
import ProductValidation from 'src/product/product.validation';
import { ProductException } from 'src/product/product.exception';
import * as moment from 'moment';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tracking)
    private readonly trackingRepository: Repository<Tracking>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectMapper() private readonly mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly robotConnectorClient: RobotConnectorClient,
    private readonly dataSource: DataSource,
  ) {}

  @OnEvent(PaymentAction.PAYMENT_PAID)
  async handleUpdateOrderStatus(requestData: { orderId: string }) {
    const context = `${OrderService.name}.${this.handleUpdateOrderStatus.name}`;
    this.logger.log(`Update order status after payment process`, context);

    const order = await this.orderRepository.findOne({
      where: { id: requestData.orderId },
      relations: ['payment'],
    });

    if (!order) {
      this.logger.error(`Order not found`, context);
      throw new OrderException(OrderValidation.ORDER_NOT_FOUND);
    }

    if (
      order.payment?.statusCode === PaymentStatus.COMPLETED &&
      order.status === OrderStatus.PENDING
    ) {
      Object.assign(order, { status: OrderStatus.PAID });
      await this.orderRepository.save(order);
      this.logger.log(`Update order status from PENDING to PAID`, context);
    }
  }

  /**
   *
   * @param {CreateOrderRequestDto} requestData The data to create a new order
   * @returns {Promise<OrderResponseDto>} The created order
   * @throws {BadRequestException} If branch is not found
   * @throws {BadRequestException} If table is not found in this branch
   * @throws {BadRequestException} If invalid data to create order item
   */
  async createOrder(
    requestData: CreateOrderRequestDto,
  ): Promise<OrderResponseDto> {
    const context = `${OrderService.name}.${this.createOrder.name}`;

    const mappedOrder: Order = await this.validateCreatedOrderData(requestData);

    const checkValidOrderItemData = await this.validateCreatedOrderItemData(
      requestData.branch,
      requestData.orderItems,
    );

    let createdOrder: Order;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      Object.assign(mappedOrder, {
        orderItems: checkValidOrderItemData.mappedOrderItems,
        subtotal: checkValidOrderItemData.subtotal,
      });
      const subtractedQuantityMenuItems = checkValidOrderItemData.subtractedQuantityMenuItems;
      const newOrder = this.orderRepository.create(mappedOrder);

      createdOrder = await queryRunner.manager.save(newOrder);

      // update menu item quantity
      for (const menuItem of subtractedQuantityMenuItems) {
        await queryRunner.manager.save(menuItem);
      }

      await queryRunner.commitTransaction();
      this.logger.log(
        `Create new order ${createdOrder.slug} successfully`,
        context,
      );
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.warn(`Create new order failed`, context);
      throw new BadRequestException('Create new order failed');
    } finally {
      await queryRunner.release();
    }

    const orderDto = this.mapper.map(createdOrder, Order, OrderResponseDto);
    return orderDto;
  }

  /**
   *
   * @param {CreateOrderRequestDto} data The data to create order
   * @returns {Promise<Order>} The result of checking
   */
  async validateCreatedOrderData(data: CreateOrderRequestDto): Promise<Order> {
    const context = `${OrderService.name}.${this.validateCreatedOrderData.name}`;
    const branch = await this.branchRepository.findOneBy({ slug: data.branch });
    if (!branch) {
      this.logger.warn(
        `${BranchValidation.BRANCH_NOT_FOUND} ${data.branch}`,
        context,
      );
      throw new BranchException(BranchValidation.BRANCH_NOT_FOUND);
    }

    let tableName: string = null; // default for take-out
    if (data.type === OrderType.AT_TABLE) {
      const table = await this.tableRepository.findOne({
        where: {
          slug: data.table,
          branch: {
            slug: data.branch,
          },
        },
      });
      if (!table) {
        this.logger.warn(
          `${TableValidation.TABLE_NOT_FOUND} ${data.table}`,
          context,
        );
        throw new TableException(TableValidation.TABLE_NOT_FOUND);
      }
      tableName = table.name;
    }

    const owner = await this.userRepository.findOneBy({ slug: data.owner });
    if (!owner) {
      this.logger.warn(
        `${OrderValidation.OWNER_NOT_FOUND} ${data.owner}`,
        context,
      );
      throw new OrderException(OrderValidation.OWNER_NOT_FOUND);
    }
    const order = this.mapper.map(data, CreateOrderRequestDto, Order);
    Object.assign(order, {
      owner: owner,
      branch: branch,
      tableName,
    });
    return order;
  }

  /**
   *
   * @param {CreateOrderItemRequestDto} data The array of data to create order item
   * @returns {Promise<CheckDataCreateOrderItemResponseDto>} The result of checking
   */
  async validateCreatedOrderItemData(
    branch: string,
    data: CreateOrderItemRequestDto[],
  ): Promise<CheckDataCreateOrderItemResponseDto> {
    const context = `${OrderService.name}.${this.validateCreatedOrderItemData.name}`;
    const now = new Date();
    const dateQuery = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0, 0, 0);
    console.log({dateQuery})
    const menu = await this.menuRepository.findOne({
      where: {
        branch: {
          slug: branch
        },
        date: dateQuery
      }
    });
    if(!menu) {
      this.logger.warn(MenuValidation.MENU_NOT_FOUND, context);
      throw new MenuException(MenuValidation.MENU_NOT_FOUND);
    }

    let subtotal: number = 0;
    const mappedOrderItems: OrderItem[] = [];
    const subtractedQuantityMenuItems: MenuItem[] = [];
    for (let i = 0; i < data.length; i++) {
      let variant = await this.variantRepository.findOneBy({
        slug: data[i].variant
      });
      if (!variant) {
        this.logger.warn(
          `${VariantValidation.VARIANT_NOT_FOUND} ${data[i].variant}`,
          context,
        );
        throw new VariantException(VariantValidation.VARIANT_NOT_FOUND);
      }

      const menuItem = await this.menuItemRepository.findOne({
        where: {
          menu: { slug: menu.slug },
          product: {
            variants: { slug: variant.slug }
          }
        }
      });
      if(!menuItem) {
        this.logger.warn(ProductValidation.PRODUCT_NOT_FOUND_IN_TODAY_MENU, context);
        throw new ProductException(ProductValidation.PRODUCT_NOT_FOUND_IN_TODAY_MENU);
      }

      if(data[i].quantity > menuItem.currentStock) {
        this.logger.warn(OrderValidation.REQUEST_QUANTITY_EXCESS_CURRENT_QUANTITY, context);
        throw new OrderException(OrderValidation.REQUEST_QUANTITY_EXCESS_CURRENT_QUANTITY);
      }

      subtotal += variant.price * data[i].quantity;
      const mappedOrderItem = this.mapper.map(
        data[i],
        CreateOrderItemRequestDto,
        OrderItem,
      );
      Object.assign(mappedOrderItem, {
        variant,
        subtotal: variant.price * data[i].quantity,
      });
      mappedOrderItems.push(mappedOrderItem);
      const restQuantity: number = menuItem.currentStock - data[i].quantity;
      Object.assign(menuItem, { currentStock: restQuantity })
      subtractedQuantityMenuItems.push(menuItem);
    }

    return { mappedOrderItems, subtotal, subtractedQuantityMenuItems };
  }

  /**
   *
   * @param {GetOrderRequestDto} options The options to retrieved order
   * @returns {Promise<AppPaginatedResponseDto<OrderResponseDto>>} All orders retrieved
   */
  async getAllOrders(
    options: GetOrderRequestDto,
  ): Promise<AppPaginatedResponseDto<OrderResponseDto>> {
    const context = `${OrderService.name}.${this.getAllOrders.name}`;

    const findOptionsWhere: FindOptionsWhere<any> = {
      branch: {
        slug: options.branch,
      },
      owner: {
        slug: options.owner,
      },
    };

    if (options.status.length > 0) {
      findOptionsWhere.status = In(options.status);
    }

    const [orders, total] = await this.orderRepository.findAndCount({
      where: findOptionsWhere,
      relations: [
        'owner',
        'orderItems.variant.size',
        'orderItems.variant.product',
        'payment',
        'invoice',
      ],
      order: { createdAt: 'DESC' },
      skip: (options.page - 1) * options.size,
      take: options.size,
    });

    const ordersDto = this.mapper.mapArray(orders, Order, OrderResponseDto);

    // Calculate total pages
    const totalPages = Math.ceil(total / options.size);
    // Determine hasNext and hasPrevious
    const hasNext = options.page < totalPages;
    const hasPrevious = options.page > 1;

    return {
      hasNext: hasNext,
      hasPrevios: hasPrevious,
      items: ordersDto,
      total,
      page: options.page,
      pageSize: options.size,
      totalPages,
    } as AppPaginatedResponseDto<OrderResponseDto>;
  }

  /**
   *
   * @param {string} slug The slug of order retrieved
   * @returns {Promise<OrderResponseDto>} The order data is retrieved
   * @throws {BadRequestException} If order is not found
   */
  async getOrderBySlug(slug: string): Promise<OrderResponseDto> {
    const context = `${OrderService.name}.${this.getOrderBySlug.name}`;
    const order = await this.orderRepository.findOne({
      where: { slug },
      relations: [
        'payment',
        'owner',
        'orderItems.variant.size',
        'orderItems.variant.product',
        'orderItems.trackingOrderItems.tracking',
        'invoice.invoiceItems',
      ],
    });

    if (!order) {
      this.logger.warn(`${OrderValidation.ORDER_NOT_FOUND} ${slug}`, context);
      throw new OrderException(OrderValidation.ORDER_NOT_FOUND);
    }

    const orderDto = this.getStatusEachOrderItemInOrder(order);
    return orderDto;
  }

  /**
   * Assign status synthesis for each order item in order
   * @param {Order} order The order data relates to tracking
   * @returns {Promise<OrderResponseDto>} The order data with order item have status synthesis
   */
  getStatusEachOrderItemInOrder(order: Order): OrderResponseDto {
    const orderItems = order.orderItems.map((item) => {
      const statusQuantities = item.trackingOrderItems.reduce(
        (acc, trackingItem) => {
          const status = trackingItem.tracking.status;

          acc[status] += trackingItem.quantity;
          return acc;
        },
        {
          [WorkflowStatus.PENDING]: 0,
          [WorkflowStatus.RUNNING]: 0,
          [WorkflowStatus.COMPLETED]: 0,
          [WorkflowStatus.FAILED]: 0,
        },
      );

      return {
        ...item,
        status: statusQuantities,
      };
    });
    const orderDto = this.mapper.map(order, Order, OrderResponseDto);
    Object.assign(orderDto, { orderItems });
    return orderDto;
  }
}
