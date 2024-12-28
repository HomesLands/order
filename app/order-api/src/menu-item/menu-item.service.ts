import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuItem } from './menu-item.entity';
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  CreateMenuItemDto,
  GetMenuItemQueryDto,
  MenuItemResponseDto,
  UpdateMenuItemDto,
} from './menu-item.dto';
import { Menu } from 'src/menu/menu.entity';
import { Product } from 'src/product/product.entity';
import { MenuException } from 'src/menu/menu.exception';
import { MenuValidation } from 'src/menu/menu.validation';
import { ProductException } from 'src/product/product.exception';
import ProductValidation from 'src/product/product.validation';
import { MenuItemException } from './menu-item.exception';
import { MenuItemValidation } from './menu-item.validation';
import { Catalog } from 'src/catalog/catalog.entity';
import { CatalogValidation } from 'src/catalog/catalog.validation';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Catalog)
    private readonly catalogRepository: Repository<Catalog>,
    @InjectMapper() private readonly mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * Create a menu item
   * @param {CreateMenuItemDto[]} createMenuItemDto The menu item data to be created
   * @returns {Promise<MenuItemResponseDto>} The menu item data after created
   * @throws {Error} if product or menu is not found
   */
  async bulkCreate(
    createMenuItemDto: CreateMenuItemDto[],
  ): Promise<MenuItemResponseDto[]> {
    const context = `${MenuItemService.name}.${this.bulkCreate.name}`;
    let menuItems: MenuItem[] = [];

    for (const menuItemDto of createMenuItemDto) {
      const product = await this.productRepository.findOne({
        where: { slug: menuItemDto.productSlug },
      });
      if (!product)
        throw new ProductException(ProductValidation.PRODUCT_NOT_FOUND);

      const menu = await this.menuRepository.findOne({
        where: { slug: menuItemDto.menuSlug },
      });
      if (!menu) throw new MenuException(MenuValidation.MENU_NOT_FOUND);

      const menuItem = this.mapper.map(
        menuItemDto,
        CreateMenuItemDto,
        MenuItem,
      );
      Object.assign(menuItem, { product, menu });

      menuItems.push(menuItem);
    }
    await this.menuRepository.manager.transaction(async (manager) => {
      await manager.insert(MenuItem, menuItems);
    });
    this.logger.log(
      `Menu items created: ${menuItems.map((m) => m.id)}`,
      context,
    );

    return this.mapper.mapArray(menuItems, MenuItem, MenuItemResponseDto);
  }

  /**
   * Create a menu item
   * @param {CreateMenuItemDto} createMenuItemDto The menu item data to be created
   * @returns {Promise<MenuItemResponseDto>} The menu item data after created
   * @throws {Error} if product or menu is not found
   */
  async create(
    createMenuItemDto: CreateMenuItemDto,
  ): Promise<MenuItemResponseDto> {
    const context = `${MenuItemService.name}.${this.create.name}`;
    const product = await this.productRepository.findOne({
      where: { slug: createMenuItemDto.productSlug },
    });
    if (!product)
      throw new ProductException(ProductValidation.PRODUCT_NOT_FOUND);

    const menu = await this.menuRepository.findOne({
      where: { slug: createMenuItemDto.menuSlug },
    });
    if (!menu) throw new MenuException(MenuValidation.MENU_NOT_FOUND);

    const existedMenuItem = await this.menuItemRepository.findOne({
      where: {
        product: { id: product.id },
        menu: { id: menu.id },
      },
    });
    if (existedMenuItem)
      throw new MenuItemException(MenuItemValidation.MENU_ITEM_EXIST);

    const menuItem = this.mapper.map(
      createMenuItemDto,
      CreateMenuItemDto,
      MenuItem,
    );
    Object.assign(menuItem, { product, menu });

    this.menuItemRepository.create(menuItem);
    const createdMenuItem = await this.menuItemRepository.save(menuItem);
    this.logger.log(`Menu item created: ${createdMenuItem.id}`, context);

    return this.mapper.map(createdMenuItem, MenuItem, MenuItemResponseDto);
  }

  /**
   * Retrieve all menu items
   * @returns {Promise<MenuItemResponseDto[]>} The menu items data
   */
  async findAll(query: GetMenuItemQueryDto): Promise<MenuItemResponseDto[]> {
    const context = `${MenuItemService.name}.${this.findAll.name}`;

    const findOptionsWhere: FindOptionsWhere<MenuItem> = {};

    if (query.menu) {
      const menu = await this.menuRepository.findOne({
        where: {
          slug: query.menu,
        },
      });
      if (!menu) {
        this.logger.error(`Menu is not found`, null, context);
        throw new MenuException(MenuValidation.MENU_NOT_FOUND);
      }
      findOptionsWhere.menu = {
        id: menu.id,
      };
    }

    if (query.catalog) {
      const catalog = await this.catalogRepository.findOne({
        where: {
          slug: query.catalog,
        },
      });
      if (!catalog) {
        this.logger.error(`Catalog is not found`, null, context);
        throw new MenuException(CatalogValidation.CATALOG_NOT_FOUND);
      }
      findOptionsWhere.product = {
        catalog: {
          id: catalog.id,
        },
      };
    }

    if (query.productName) {
      findOptionsWhere.product = {
        name: Like(`%${query.productName}%`),
      };
    }

    if (query.minPrice && query.maxPrice) {
      findOptionsWhere.product = {
        variants: {
          price: Between(query.minPrice, query.maxPrice),
        },
      };
    }

    const menuItems = await this.menuItemRepository.find({
      where: findOptionsWhere,
      order: {
        createdAt: 'DESC',
        product: {
          variants: {
            price: 'ASC',
          },
        },
      },
      relations: ['product.catalog', 'product.variants.size'],
    });
    return this.mapper.mapArray(menuItems, MenuItem, MenuItemResponseDto);
  }

  /**
   * Retrieve specific menu item
   * @param {string} slug
   * @returns {Promise<MenuItemResponseDto>} The menu item data
   */
  async findOne(slug: string): Promise<MenuItemResponseDto> {
    const menuItem = await this.menuItemRepository.findOne({
      where: { slug },
      relations: ['product.catalog', 'product.variants.size'],
      order: {
        product: {
          variants: {
            price: 'ASC',
          },
        },
      },
    });
    if (!menuItem)
      throw new MenuItemException(MenuItemValidation.MENU_ITEM_NOT_FOUND);
    return this.mapper.map(menuItem, MenuItem, MenuItemResponseDto);
  }

  async update(slug: string, updateMenuItemDto: UpdateMenuItemDto) {
    const context = `${MenuItemService.name}.${this.update.name}`;

    const menuItem = await this.menuItemRepository.findOne({
      where: { slug },
    });
    if (!menuItem)
      throw new MenuItemException(MenuItemValidation.MENU_ITEM_NOT_FOUND);

    Object.assign(menuItem, {
      ...updateMenuItemDto,
      currentStock: updateMenuItemDto.defaultStock,
    } as MenuItem);
    await this.menuItemRepository.manager.transaction(async (manager) => {
      try {
        await manager.save(menuItem);
        this.logger.log(
          `Menu item ${menuItem.slug} updated successfully`,
          context,
        );
      } catch (error) {
        this.logger.error(
          `Error when updating menu item: ${error.message}`,
          null,
          context,
        );
        throw new MenuItemException(
          MenuItemValidation.UPDATE_MENU_ITEM_ERROR,
          error.message,
        );
      }
    });
    this.logger.log(`Menu item updated: ${menuItem.id}`, context);

    return this.mapper.map(menuItem, MenuItem, MenuItemResponseDto);
  }

  async remove(slug: string) {
    const context = `${MenuItemService.name}.${this.remove.name}`;

    const menuItem = await this.menuItemRepository.findOne({
      where: { slug },
    });
    if (!menuItem)
      throw new MenuItemException(MenuItemValidation.MENU_ITEM_NOT_FOUND);

    await this.menuItemRepository.remove(menuItem);
    this.logger.log(`Menu item removed: ${menuItem.id}`, context);

    return menuItem;
  }
}
