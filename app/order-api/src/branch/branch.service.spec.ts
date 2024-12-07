import { Test, TestingModule } from '@nestjs/testing';
import { BranchService } from './branch.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Branch } from './branch.entity';
import { MAPPER_MODULE_PROVIDER } from 'src/app/app.constants';

describe('BranchService', () => {
  let service: BranchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BranchService,
        {
          provide: getRepositoryToken(Branch),
          useValue: {},
        },
        {
          provide: MAPPER_MODULE_PROVIDER,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<BranchService>(BranchService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
