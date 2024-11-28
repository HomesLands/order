import { MockType, repositoryMockFactory } from "src/test-utils/repository-mock.factory";
import { OrderService } from "./order.service";
import { Repository } from "typeorm";
import { Order } from "./order.entity";
import { Mapper } from "@automapper/core";
import { Test, TestingModule } from "@nestjs/testing";
import { Table } from "src/table/table.entity";
import { Branch } from "src/branch/branch.entity";
import { User } from "src/user/user.entity";
import { Variant } from "src/variant/variant.entity";
import { MAPPER_MODULE_PROVIDER } from "src/app/app.constants";
import { mapperMockFactory } from "src/test-utils/mapper-mock.factory";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { getRepositoryToken } from "@nestjs/typeorm";
import { OrderType } from "./order.contants";
import { CreateOrderRequestDto } from "./order.dto";
import { Tracking } from "src/tracking/tracking.entity";
import { RobotConnectorClient } from "src/robot-connector/robot-connector.client";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { DataSource } from 'typeorm';
import { BadRequestException } from "@nestjs/common";
import { BranchException } from "src/branch/branch.exception";
import { TableException } from "src/table/table.exception";
import { AuthException } from "src/auth/auth.exception";
import { OrderException } from "./order.exception";
import { CreateOrderItemRequestDto } from "src/order-item/order-item.dto";
import { isValid } from "shortid";
import { OrderItem } from "src/order-item/order-item.entity";
import { Size } from "src/size/size.entity";
import { Product } from "src/product/product.entity";
import { VariantException } from "src/variant/variant.exception";

describe('OrderService', () => {
  let service: OrderService;
  let orderRepositoryMock: MockType<Repository<Order>>;
  let tableRepositoryMock: MockType<Repository<Table>>;
  let branchRepositoryMock: MockType<Repository<Branch>>;
  let userRepositoryMock: MockType<Repository<User>>;
  let variantRepositoryMock: MockType<Repository<Variant>>;
  let trackingRepositoryMock: MockType<Repository<Tracking>>;
  let mapperMock: MockType<Mapper>;

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        RobotConnectorClient,
        HttpService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'SALT_ROUNDS') {
                return 10;
              }
              return null;
            }),
          },
        },
        {
          provide: 'AXIOS_INSTANCE_TOKEN',
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
          },
        },
        { 
          provide: DataSource, 
          useValue: mockDataSource 
        },
        {
          provide: getRepositoryToken(Order),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Table),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Variant),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Branch),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Tracking),
          useFactory: repositoryMockFactory,
        },
        {
          provide: MAPPER_MODULE_PROVIDER,
          useFactory: mapperMockFactory,
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: console,
        },
      ]
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepositoryMock = module.get(getRepositoryToken(Order));
    variantRepositoryMock = module.get(getRepositoryToken(Variant));
    branchRepositoryMock = module.get(getRepositoryToken(Branch));
    tableRepositoryMock = module.get(getRepositoryToken(Table));
    userRepositoryMock = module.get(getRepositoryToken(User));
    trackingRepositoryMock = module.get(getRepositoryToken(Tracking));
    mapperMock = module.get(MAPPER_MODULE_PROVIDER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateCreatedOrderData - validate data before create order ', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return invalid result when branch is not found', async () => {
      const mockInput = {
        type: OrderType.AT_TABLE,
        table: "mock-table-slug",
        branch: "mock-branch-slug",
        owner: "mock-user-slug",
      } as CreateOrderRequestDto;

      (branchRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);
      await expect(service.validateCreatedOrderData(mockInput)).rejects.toThrow(BranchException);
    });

    it('should return invalid result when order at table but table is not found in this branch', async () => {
      const mockInput = {
        type: OrderType.AT_TABLE,
        table: "mock-table-slug",
        branch: "mock-branch-slug",
        owner: "mock-user-slug",
      } as CreateOrderRequestDto;
      const mockBranch = {
        name: "mock-branch-name",
        address: "mock-branch-address",
        id: "mock-branch-id",
        slug: "mock-branch-slug",
        createdAt: new Date(),
        updatedAt: new Date()
      } as Branch;

      (branchRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(mockBranch);
      (tableRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.validateCreatedOrderData(mockInput)).rejects.toThrow(TableException);
    });

    it('should return invalid result when order at table but owner is not found', async () => {
      const mockInput = {
        type: OrderType.AT_TABLE,
        table: "mock-table-slug",
        branch: "mock-branch-slug",
        owner: "mock-user-slug",
      } as CreateOrderRequestDto;
      const mockBranch = {
        name: "mock-branch-name",
        address: "mock-branch-address",
        id: "mock-branch-id",
        slug: "mock-branch-slug",
        createdAt: new Date(),
        updatedAt: new Date()
      } as Branch;
      const table  = {
        name: "mock-table-name",
        branch: new Branch(),
        id: "mock-table-id",
        slug: "mock-table-slug",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "mock-status"
      } as Table;

      (branchRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(mockBranch);
      (tableRepositoryMock.findOne as jest.Mock).mockResolvedValue(table);
      (userRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);
      await expect(service.validateCreatedOrderData(mockInput)).rejects.toThrow(OrderException);
    });

    it('should return valid result when order at table', async () => {
      const mockInput = {
        type: OrderType.AT_TABLE,
        table: "mock-table-slug",
        branch: "mock-branch-slug",
        owner: "mock-user-slug",
      } as CreateOrderRequestDto;
      const mockBranch = {
        name: "mock-branch-name",
        address: "mock-branch-address",
        id: "mock-branch-id",
        slug: "mock-branch-slug",
        createdAt: new Date(),
        updatedAt: new Date()
      } as Branch;
      const table  = {
        name: "mock-table-name1",
        branch: new Branch(),
        id: "mock-table-id",
        slug: "mock-table-slug",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "mock-status"
      } as Table;
      const owner = {
        phonenumber: "",
        password: "",
        firstName: "",
        lastName: "",
        isActive: false,
        branch: new Branch,
        id: "mock-user-id",
        slug: "mock-user-slug",
        createdAt: new Date(),
        updatedAt: new Date()
      } as User;
      const mockOutput = {
        subtotal: 0,
        status: "mock-order-status",
        type: "mock-order-type",
        branch: new Branch(),
        owner: new User(),
        id: "mock-order-id",
        slug: "mock-order-slug",
        createdAt: new Date(),
        updatedAt: new Date()
      } as Order;
      
      (branchRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(mockBranch);
      (tableRepositoryMock.findOne as jest.Mock).mockResolvedValue(table);
      (userRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(owner);
      (mapperMock.map as jest.Mock).mockReturnValue(mockOutput)
      expect(await service.validateCreatedOrderData(mockInput)).toEqual(mockOutput);
    });

    it('should return valid result when order take out', async () => {
      const mockInput = {
        type: OrderType.TAKE_OUT,
        table: "mock-table-slug",
        branch: "mock-branch-slug",
        owner: "mock-user-slug",
      } as CreateOrderRequestDto;
      const mockBranch = {
        name: "mock-branch-name",
        address: "mock-branch-address",
        id: "mock-branch-id",
        slug: "mock-branch-slug",
        createdAt: new Date(),
        updatedAt: new Date()
      } as Branch;
      const owner = {
        phonenumber: "",
        password: "",
        firstName: "",
        lastName: "",
        isActive: false,
        branch: new Branch,
        id: "mock-user-id",
        slug: "mock-user-slug",
        createdAt: new Date(),
        updatedAt: new Date()
      } as User;
      const mockOutput = {
        subtotal: 0,
        status: "mock-order-status",
        type: "mock-order-type",
        branch: new Branch(),
        owner: new User(),
        id: "mock-order-id",
        slug: "mock-order-slug",
        createdAt: new Date(),
        updatedAt: new Date()
      } as Order;
      
      (branchRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(mockBranch);
      (userRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(owner);
      (mapperMock.map as jest.Mock).mockReturnValue(mockOutput)
      expect(await service.validateCreatedOrderData(mockInput)).toEqual(mockOutput);
    });
  });

  describe('validateCreatedOrderItemData - validate data before create order items', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return invalid result when a variant of data not found', async () => {
      const createOrderItem: CreateOrderItemRequestDto = {
        quantity: 0,
        note: "mock-note",
        variant: "mock-variant-slug"
      };
      const mockInput = [createOrderItem];
      (variantRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(service.validateCreatedOrderItemData(mockInput)).rejects.toThrow(VariantException);
    });

    it('should return valid result', async () => {
      const createOrderItem: CreateOrderItemRequestDto = {
        quantity: 1,
        note: "mock-note",
        variant: "mock-variant-slug"
      };
      const mockInput = [createOrderItem, createOrderItem];

      const variant1 = {
        price: 100,
        size: new Size(),
        product: new Product(),
        id: "",
        slug: "",
        createdAt: new Date(),
        updatedAt: new Date()
      } as Variant;
      const variant2 = {
        price: 200,
        size: new Size(),
        product: new Product(),
        id: "",
        slug: "",
        createdAt: new Date(),
        updatedAt: new Date()
      } as Variant;

      const orderItem = {
        quantity: 1,
        subtotal: 100,
        order: new Order(),
        variant: new Variant(),
        trackingOrderItems: [],
        id: "",
        slug: "",
        createdAt: undefined,
        updatedAt: undefined
      } as OrderItem;
      const mappedOrderItems = [orderItem, orderItem];
      const mockOutput = { mappedOrderItems, subtotal: 300 };

      (variantRepositoryMock.findOneBy as jest.Mock).mockImplementationOnce(() => variant1);
      (variantRepositoryMock.findOneBy as jest.Mock).mockImplementationOnce(() => variant2);
      (mapperMock.map as jest.Mock).mockImplementationOnce(() => orderItem);
      (mapperMock.map as jest.Mock).mockImplementationOnce(() => orderItem);

      expect(await service.validateCreatedOrderItemData(mockInput)).toEqual(mockOutput);
    });
  });

  describe('createOrder - create a new order', () => {
    // beforeEach(() => {
    //   jest.clearAllMocks();
    // });



  });
});