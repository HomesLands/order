import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/role/roles.decorator';
import { RoleEnum } from 'src/role/role.enum';
import { ApiResponseWithType } from 'src/app/app.decorator';
import {
  GetRevenueQueryDto,
  RevenueQueryResponseDto,
  RevenueResponseDto,
} from './revenue.dto';
import { AppResponseDto } from 'src/app/app.dto';

@Controller('revenue')
@ApiTags('Revenue')
@ApiBearerAuth()
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  @Get()
  @HasRoles(
    RoleEnum.Staff,
    RoleEnum.Chef,
    RoleEnum.Manager,
    RoleEnum.Admin,
    RoleEnum.SuperAdmin,
  )
  @ApiOperation({ summary: 'Get all revenues' })
  @ApiResponseWithType({
    type: RevenueQueryResponseDto,
    isArray: true,
    status: HttpStatus.OK,
    description: 'The revenues retrieved successfully',
  })
  async findAll(
    @Query(new ValidationPipe({ transform: true })) query: GetRevenueQueryDto,
  ) {
    const result = await this.revenueService.findAll(query);
    return {
      message: 'Revenues have been retrieved successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<RevenueResponseDto[]>;
  }
}