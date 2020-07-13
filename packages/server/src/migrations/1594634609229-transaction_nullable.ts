import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionNullable1594634609229 implements MigrationInterface {
    name = "transactionNullable1594634609229";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "client_transaction_log" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "client_id" character varying, "transaction_id" bigint, CONSTRAINT "PK_bd0db14d7c0d3ad6b4b77941041" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "client" ADD "type" character varying NOT NULL DEFAULT 'PGP'`,
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ALTER COLUMN "note" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ALTER COLUMN "sourceAccount" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ALTER COLUMN "isRemitterCharge" SET DEFAULT false`,
        );
        await queryRunner.query(
            `ALTER TABLE "dept_remind" ALTER COLUMN "completeNote" SET DEFAULT ''`,
        );
        await queryRunner.query(
            `ALTER TABLE "client_transaction_log" ADD CONSTRAINT "FK_1cebaaee39c0409db0f00e85348" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "client_transaction_log" ADD CONSTRAINT "FK_a04534cdcd0fcf128b764e0dff6" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "client_transaction_log" DROP CONSTRAINT "FK_a04534cdcd0fcf128b764e0dff6"`,
        );
        await queryRunner.query(
            `ALTER TABLE "client_transaction_log" DROP CONSTRAINT "FK_1cebaaee39c0409db0f00e85348"`,
        );
        await queryRunner.query(
            `ALTER TABLE "dept_remind" ALTER COLUMN "completeNote" DROP DEFAULT`,
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ALTER COLUMN "isRemitterCharge" DROP DEFAULT`,
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ALTER COLUMN "sourceAccount" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ALTER COLUMN "note" SET NOT NULL`,
        );
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TABLE "client_transaction_log"`);
    }
}
