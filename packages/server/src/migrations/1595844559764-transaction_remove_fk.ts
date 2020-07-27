import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionRemoveFk1595844559764 implements MigrationInterface {
    name = "transactionRemoveFk1595844559764";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP CONSTRAINT "FK_a4e656f651b0721aaa489987dd0"`,
        );
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "type"`);
        await queryRunner.query(
            `CREATE TYPE "client_type_enum" AS ENUM('PGP', 'RSA')`,
        );
        await queryRunner.query(
            `ALTER TABLE "client" ADD "type" "client_type_enum" NOT NULL DEFAULT 'PGP'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "client_type_enum"`);
        await queryRunner.query(
            `ALTER TABLE "client" ADD "type" character varying NOT NULL DEFAULT 'PGP'`,
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD CONSTRAINT "FK_a4e656f651b0721aaa489987dd0" FOREIGN KEY ("desAccount") REFERENCES "users"("accountNumber") ON DELETE NO ACTION ON UPDATE CASCADE`,
        );
    }
}
