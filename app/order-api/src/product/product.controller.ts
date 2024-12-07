import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { Public } from 'src/auth/public.decorator';
import {
  CreateProductRequestDto,
  ProductResponseDto,
  UpdateProductRequestDto,
} from './product.dto';
import { ApiResponseWithType } from 'src/app/app.decorator';
import { AppResponseDto } from 'src/app/app.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoleEnum } from 'src/role/role.enum';
import { HasRoles } from 'src/role/roles.decorator';

@ApiTags('Product')
@Controller('products')
@ApiBearerAuth()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Create a new product successfully',
    type: ProductResponseDto,
  })
  @ApiOperation({ summary: 'Create new product' })
  @ApiResponse({ status: 200, description: 'Create new product successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @HasRoles(RoleEnum.Manager, RoleEnum.Admin, RoleEnum.Staff, RoleEnum.Chef)
  async createProduct(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    requestData: CreateProductRequestDto,
  ) {
    const result = await this.productService.createProduct(requestData);
    return {
      message: 'Product have been created successfully',
      statusCode: HttpStatus.CREATED,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<ProductResponseDto>;
  }

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'All products have been retrieved successfully',
    type: ProductResponseDto,
    isArray: true,
  })
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Get all products successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiQuery({
    name: 'catalog',
    required: false,
    description: 'Filter products by catalog',
    type: String,
  })
  async getAllProducts(
    @Query('catalog') catalog: string,
  ): Promise<AppResponseDto<ProductResponseDto[]>> {
    const result = await this.productService.getAllProducts(catalog);
    return {
      message: 'All products have been retrieved successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<ProductResponseDto[]>;
  }

  @Patch(':slug')
  @HttpCode(HttpStatus.OK)
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Update product successfully',
    type: ProductResponseDto,
  })
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, description: 'Update product successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiParam({
    name: 'slug',
    description: 'The slug of the product to be updated',
    required: true,
    example: '',
  })
  @HasRoles(RoleEnum.Manager, RoleEnum.Admin, RoleEnum.Chef, RoleEnum.Staff)
  async updateProduct(
    @Param('slug') slug: string,
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    updateProductDto: UpdateProductRequestDto,
  ) {
    const result = await this.productService.updateProduct(
      slug,
      updateProductDto,
    );

    return {
      message: 'Product have been updated successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<ProductResponseDto>;
  }

  @Delete(':slug')
  @HttpCode(HttpStatus.OK)
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Delete product successfully',
    type: String,
  })
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Delete product successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiParam({
    name: 'slug',
    description: 'The slug of the product to be deleted',
    required: true,
    example: '',
  })
  @HasRoles(RoleEnum.Manager, RoleEnum.Admin)
  async deleteProduct(
    @Param('slug') slug: string,
  ): Promise<AppResponseDto<string>> {
    const result = await this.productService.deleteProduct(slug);
    return {
      message: 'Product have been deleted successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result: `${result} product have been deleted successfully`,
    } as AppResponseDto<string>;
  }

  @Patch(':slug/upload')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Product image have been uploaded successfully',
    type: ProductResponseDto,
  })
  @ApiOperation({ summary: 'Upload product image' })
  @ApiResponse({
    status: 200,
    description: 'Product image have been uploaded successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @HasRoles(RoleEnum.Manager, RoleEnum.Admin, RoleEnum.Chef, RoleEnum.Staff)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProductImage(
    @Param('slug') slug: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.productService.uploadProductImage(slug, file);
    return {
      message: 'Product have been created successfully',
      statusCode: HttpStatus.CREATED,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<ProductResponseDto>;
  }

  @Get(':slug')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiOperation({ summary: 'Get product' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getProduct(
    @Param('slug') slug: string,
  ): Promise<AppResponseDto<ProductResponseDto>> {
    const result = await this.productService.getProduct(slug);
    return {
      message: 'Product retrieved successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<ProductResponseDto>;
  }
}
