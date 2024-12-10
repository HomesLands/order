import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Product } from './product.entity';
import { In, Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateProductRequestDto,
  ProductResponseDto,
  UpdateProductRequestDto,
} from './product.dto';
import { Variant } from 'src/variant/variant.entity';
import { Catalog } from 'src/catalog/catalog.entity';
import { FileService } from 'src/file/file.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ProductException } from './product.exception';
import ProductValidation from './product.validation';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectRepository(Catalog)
    private readonly catalogRepository: Repository<Catalog>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly fileService: FileService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * Get product by slug
   * @param {string} slug The product slug is retrieved
   * @returns {Promise<ProductResponseDto>} The product data is retrieved
   * @throws {ProductException} if product not found
   */
  async getProduct(slug: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: ['catalog', 'variants.size'],
    });
    console.log({product})
    if (!product) {
      throw new ProductException(ProductValidation.PRODUCT_NOT_FOUND);
    }
    return this.mapper.map(product, Product, ProductResponseDto);
  }

  /**
   * Upload product image
   * @param {string} slug The product slug is uploaded image
   * @param {Express.Multer.File} file The image file is uploaded
   * @returns {Promise<ProductResponseDto>} The product data after uploaded image
   * @throws {ProductException} if product is not found
   */
  async uploadProductImage(
    slug: string,
    file: Express.Multer.File,
  ): Promise<ProductResponseDto> {
    const context = `${ProductService.name}.${this.uploadProductImage.name}`;
    const product = await this.productRepository.findOne({
      where: {
        slug,
      },
    });
    if (!product) {
      this.logger.error(ProductValidation.PRODUCT_NOT_FOUND.message, context);
      throw new ProductException(ProductValidation.PRODUCT_NOT_FOUND);
    }

    // Remove old image
    this.fileService.removeFile(product.image);

    const image = await this.fileService.uploadFile(file);
    product.image = `${image.name}`;
    const updatedProduct = await this.productRepository.save(product);

    this.logger.log(
      `Product image ${image.name} uploaded successfully`,
      context,
    );

    return this.mapper.map(updatedProduct, Product, ProductResponseDto);
  }

  async deleteProductImage(
    slug: string,
    name: string,
  ): Promise<number> {
    const context = `${ProductService.name}.${this.deleteProductImage.name}`;
    const product = await this.productRepository.findOne({
      where: {
        slug,
      },
    });
    if (!product) {
      this.logger.error(ProductValidation.PRODUCT_NOT_FOUND.message, context);
      throw new ProductException(ProductValidation.PRODUCT_NOT_FOUND);
    }

    // Remove old image
    this.fileService.removeFile(name);

    const oldImages = JSON.parse(product.images);
    const newImages = oldImages.filter((item) => item !== name);
    product.images = JSON.stringify(newImages);
    await this.productRepository.save(product);
    return 1;
  }

  async uploadMultiProductImages(
    slug: string,
    files: Express.Multer.File[],
  ): Promise<ProductResponseDto> {
    const context = `${ProductService.name}.${this.uploadMultiProductImages.name}`;
    const product = await this.productRepository.findOne({
      where: {
        slug,
      },
    });
    if (!product) {
      this.logger.error(ProductValidation.PRODUCT_NOT_FOUND.message, context);
      throw new ProductException(ProductValidation.PRODUCT_NOT_FOUND);
    }

    const handleNameFiles = this.fileService.handleDuplicateFilesName(files);
    const imagesUpload = await this.fileService.uploadFiles(handleNameFiles);
    const nameImagesUpload = imagesUpload.map((item) => item.name);

    let images: string[] = [];
    if(product.images) {
      images = JSON.parse(product.images);
    }
    images = images.concat(nameImagesUpload);
    product.images = JSON.stringify(images);

    const updatedProduct = await this.productRepository.save(product);

    this.logger.log(
      `Product images uploaded successfully`,
      context,
    );

    return this.mapper.map(updatedProduct, Product, ProductResponseDto);
  }  

  /**
   * Create a new product
   * @param {CreateProductRequestDto} createProductDto The data to create product
   * @returns {Promise<ProductResponseDto>} The created product
   * @throws {BadRequestException} if the product name already exists
   * @throws {BadRequestException} if the catalog with specified slug is not found
   */
  async createProduct(
    createProductDto: CreateProductRequestDto,
  ): Promise<ProductResponseDto> {
    const context = `${ProductService.name}.${this.createProduct.name}`;
    const product = await this.productRepository.findOneBy({
      name: createProductDto.name,
    });
    if (product) {
      this.logger.error(ProductValidation.PRODUCT_NAME_EXIST.message, context);
      throw new ProductException(ProductValidation.PRODUCT_NAME_EXIST);
    }

    const catalog = await this.catalogRepository.findOneBy({
      slug: createProductDto.catalog,
    });
    if (!catalog) throw new BadRequestException('Catalog is not found');

    const productData = this.mapper.map(
      createProductDto,
      CreateProductRequestDto,
      Product,
    );
    Object.assign(productData, { catalog });
    
    const newProduct = this.productRepository.create(productData);
    const createdProduct = await this.productRepository.save(newProduct);
    this.logger.log(
      `Product ${createdProduct.name} created successfully`,
      context,
    );

    const productDto = this.mapper.map(
      createdProduct,
      Product,
      ProductResponseDto,
    );
    return productDto;
  }

  /**
   * Get all products or get products by catalog
   * @param {string} catalog The catalog slug if get product by catalog
   * @returns {Promise<ProductResponseDto[]>} The products array is retrieved
   */
  async getAllProducts(catalog?: string): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.find({
      where: {
        catalog: {
          slug: catalog,
        },
      },
      relations: ['catalog', 'variants.size'],
    });
    const productsDto = this.mapper.mapArray(
      products,
      Product,
      ProductResponseDto,
    );
    return productsDto;
  }

  /**
   * Update the product information
   * @param {string} slug The product slug is updated
   * @param {UpdateProductRequestDto} requestData The data to update product
   * @returns {Promise<ProductResponseDto>} The product data after updated
   * @throws {BadRequestException} if product that need updating is not found
   * @throws {BadRequestException} if catalog update for product is not found
   */
  async updateProduct(
    slug: string,
    requestData: UpdateProductRequestDto,
  ): Promise<ProductResponseDto> {
    const context = `${ProductService.name}.${this.updateProduct.name}`;
    const product = await this.productRepository.findOneBy({ slug });
    if (!product)
      throw new ProductException(ProductValidation.PRODUCT_NOT_FOUND);

    const catalog = await this.catalogRepository.findOneBy({
      slug: requestData.catalog,
    });
    if (!catalog) throw new BadRequestException('Catalog not found');

    const productData = this.mapper.map(
      requestData,
      UpdateProductRequestDto,
      Product,
    );

    Object.assign(product, { ...productData, catalog });
    const updatedProduct = await this.productRepository.save(product);
    this.logger.log(
      `Product ${updatedProduct.name} updated successfully`,
      context,
    );

    const productDto = this.mapper.map(
      updatedProduct,
      Product,
      ProductResponseDto,
    );
    return productDto;
  }

  /**
   * Delete product by slug
   * @param {string} slug The slug of product is deleted
   * @returns {Promise<number>} The number of product records is deleted
   * @throws {BadRequestException} if product is not found
   */
  async deleteProduct(slug: string): Promise<number> {
    const context = `${ProductService.name}.${this.deleteProduct.name}`;
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: ['variants'],
    });
    if (!product) throw new BadRequestException('Product not found');

    // Delete variants
    await this.deleteVariantsRelatedProduct(product.variants);
    const deleted = await this.productRepository.softDelete({ slug });
    this.logger.log(`Product ${slug} deleted successfully`, context);

    return deleted.affected || 0;
  }

  /**
   * Deleted list variants is related to product
   * @param {Variant[]} variants The array of variants is deleted
   */
  async deleteVariantsRelatedProduct(variants: Variant[]): Promise<void> {
    if (variants.length < 1) return;

    const variantSlugs = variants.map((item) => item.slug);
    await this.variantRepository.softDelete({
      slug: In(variantSlugs),
    });
  }
}
