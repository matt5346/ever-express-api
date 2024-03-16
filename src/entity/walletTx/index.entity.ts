import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ schema: "public", name: "wallet_tx" })
export class WalletTxEntity {
  @PrimaryColumn()
  txHash!: string;

  @Column()
  address!: string;

  @Column()
  isDeposit!: boolean;

  @Column()
  amount!: string;

  @Column()
  time!: string;
}
