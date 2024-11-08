import { Entity, Column, OneToMany } from 'typeorm';
import { Base } from "src/app/base.entity";
import { Variant } from "src/variant/variant.entity";

@Entity("size_tbl")
export class Size extends Base {
  @Column({ name: "name_column" })
  name: string;

  @Column({ name: "description_column", nullable: true })
  description?: string;

  @OneToMany(() => Variant, (variant) => variant.size)
  variants: Variant[];
}