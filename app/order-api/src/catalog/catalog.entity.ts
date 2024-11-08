import { Entity, Column, OneToMany } from 'typeorm';
import { Base } from "src/app/base.entity";
import { Product } from "src/product/product.entity";

@Entity("catalog_tbl")
export class Catalog extends Base {
  @Column({ name: "name_column" })
  name: string;

  @OneToMany(() => Product, (product) => product.catalog)
  products: Product[];
}