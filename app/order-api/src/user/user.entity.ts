import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Base } from "src/app/base.entity";

@Entity("user_tbl")
export class User extends Base {
  @Column({ name: "phonenumber_column" })
  phonenumber: string;

  @Column({ name: "password_column" })
  password: string;

  @Column({ name: "first_name_column" })
  firstName: string;

  @Column({ name: "last_name_column" })
  lastName: string;

  @Column({ name: "is_active_column", default: true })
  isActive: boolean;

  @Column({ name: "dob_column", nullable: true })
  dob?: string;

  @Column({ name: "email_column", nullable: true })
  email?: string;

  @Column({ name: "address_column", nullable: true })
  address?: string;
}
