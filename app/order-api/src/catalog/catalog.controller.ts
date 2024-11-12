import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { 
  HttpStatus,
  HttpCode,
  Post,
  Body,
  Controller,
  ValidationPipe,
  Get
} from '@nestjs/common';

import { CreateCatalogRequestDto, CatalogResponseDto } from './catalog.dto';
import { CatalogService } from './catalog.service';
import { Public } from 'src/auth/public.decorator';

@ApiTags('Catalog')
@Controller('catalogs')
export class CatalogController {
  constructor(
    private sizeService: CatalogService
  ){}

  @HttpCode(HttpStatus.OK)
  @Post()
  @Public()
  @ApiOperation({ summary: 'Create new catalog' })
  @ApiResponse({ status: 200, description: 'Create new catalog successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createCatalog(
    @Body(ValidationPipe)
    requestData: CreateCatalogRequestDto
  ): Promise<CatalogResponseDto> {
    return this.sizeService.createCatalog(requestData);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all catalogs' })
  @ApiResponse({ status: 200, description: 'Get all catalogs successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAllSizes(): Promise<CatalogResponseDto[]> {
    return this.sizeService.getAllCatalogs();
  }
}