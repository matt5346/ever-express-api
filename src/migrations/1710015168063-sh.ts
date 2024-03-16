import { MigrationInterface, QueryRunner } from "typeorm";

export class Sh1710015168063 implements MigrationInterface {
    name = 'Sh1710015168063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "walletsData" ("id" SERIAL NOT NULL, "address" character varying NOT NULL, "time" character varying NOT NULL, CONSTRAINT "PK_863c16139c97a71d679f3f7c9a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "walletTx" ("id" SERIAL NOT NULL, "txHash" character varying NOT NULL, "time" character varying NOT NULL, CONSTRAINT "PK_92cf8815e73f041c2ad3497b972" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "walletTx"`);
        await queryRunner.query(`DROP TABLE "walletsData"`);
    }

}
