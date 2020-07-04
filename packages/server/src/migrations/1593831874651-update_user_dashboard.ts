import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserDashboard1593831874651 implements MigrationInterface {
    name = "updateUserDashboard1593831874651";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "deposit_log" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "transaction_id" bigint, "admin_id" bigint, CONSTRAINT "PK_33c78802ab766349b470eb66fac" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "dept_remind" ADD "name" character varying NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD "isRemitterCharge" boolean NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "UQ_7fa878708339fe1fb34707db456" UNIQUE ("accountNumber")`,
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD CONSTRAINT "FK_a4e656f651b0721aaa489987dd0" FOREIGN KEY ("desAccount") REFERENCES "users"("accountNumber") ON DELETE NO ACTION ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE "deposit_log" ADD CONSTRAINT "FK_fc4c7ed2d88a3dc26f7a334141f" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "deposit_log" ADD CONSTRAINT "FK_5e6953218e564f29b31bbe6bc11" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "deposit_log" DROP CONSTRAINT "FK_5e6953218e564f29b31bbe6bc11"`,
        );
        await queryRunner.query(
            `ALTER TABLE "deposit_log" DROP CONSTRAINT "FK_fc4c7ed2d88a3dc26f7a334141f"`,
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP CONSTRAINT "FK_a4e656f651b0721aaa489987dd0"`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" DROP CONSTRAINT "UQ_7fa878708339fe1fb34707db456"`,
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP COLUMN "isRemitterCharge"`,
        );
        await queryRunner.query(`ALTER TABLE "dept_remind" DROP COLUMN "name"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "deposit_log"`);
    }
}
