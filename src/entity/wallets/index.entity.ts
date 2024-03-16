import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ schema: "public", name: "wallets_data" })
export class WalletEntity {
  @PrimaryColumn()
  userId!: string;

  @Column()
  address!: string;

  @Column()
  time!: string;
}
