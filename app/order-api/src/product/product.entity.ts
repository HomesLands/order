import { Entity, Column, ManyToMany, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Base } from "src/app/base.entity";
import { Catalog } from "src/catalog/catalog.entity";
import { Variant } from "src/variant/variant.entity";

@Entity("product_tbl")
export class Product extends Base {
  @Column({ name: "name_column" })
  name: string;

  @Column({ name: "description_column" })
  description: string;

  @Column({ name: "price_column" })
  price: number;

  @Column({ name: "is_active_column", default: true })
  isActive: boolean;

  @Column({ name: "is_limit_column", default: true })
  isLimit: boolean;

  @Column({ name: "image_column", nullable: true })
  image?: string;

  @Column({ name: "rating_column", nullable: true })
  rating?: number;

  @ManyToOne(() => Catalog, (catalog) => catalog.products)
  @JoinColumn({ name: "catalog_column" })
  catalog: Catalog;

  @OneToMany(() => Variant, (variant) => variant.product)
  variants: Variant[];
}
