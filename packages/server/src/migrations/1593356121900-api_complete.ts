import { MigrationInterface, QueryRunner } from "typeorm";

export class ApiComplete1593356121900 implements MigrationInterface {
    name = "apiComplete1593356121900";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "admin_role_enum" AS ENUM('ADMIN', 'EMPLOYEE')`,
            undefined,
        );
        await queryRunner.query(
            `CREATE TABLE "admin" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "admin_role_enum" NOT NULL, CONSTRAINT "UQ_de87485f6489f5d0995f5841952" UNIQUE ("email"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`,
            undefined,
        );
        await queryRunner.query(
            `CREATE TABLE "dept_remind" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "amount" integer NOT NULL, "remindNote" character varying NOT NULL, "completeNote" character varying NOT NULL, "isDone" boolean NOT NULL DEFAULT false, "sourceAccount" character varying NOT NULL, "desAccount" character varying NOT NULL, CONSTRAINT "PK_7121e191c21b08d579495aaf7e9" PRIMARY KEY ("id"))`,
            undefined,
        );
        await queryRunner.query(
            `CREATE TABLE "otp" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "code" integer NOT NULL, "expire" TIMESTAMP NOT NULL, "isUsed" boolean NOT NULL DEFAULT false, "userId" bigint, CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`,
            undefined,
        );
        await queryRunner.query(
            `CREATE TYPE "receiverlist_banktype_enum" AS ENUM('LOCAL', 'PGP', 'RSA')`,
            undefined,
        );
        await queryRunner.query(
            `CREATE TABLE "receiverlist" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "desAccountNumber" character varying NOT NULL, "name" character varying NOT NULL, "bankType" "receiverlist_banktype_enum" NOT NULL, "userId" bigint, CONSTRAINT "PK_c7c6dcc34869771c63e182b20f7" PRIMARY KEY ("id"))`,
            undefined,
        );
        await queryRunner.query(
            `CREATE TYPE "transaction_banktype_enum" AS ENUM('LOCAL', 'PGP', 'RSA')`,
            undefined,
        );
        await queryRunner.query(
            `CREATE TABLE "transaction" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "note" character varying NOT NULL, "sourceAccount" character varying NOT NULL, "desAccount" character varying NOT NULL, "amount" integer NOT NULL, "bankType" "transaction_banktype_enum" NOT NULL, "isDebtPay" boolean NOT NULL, "isMyBankSend" boolean, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
            undefined,
        );
        await queryRunner.query(
            `CREATE TABLE "saving_account" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "amount" integer NOT NULL, "time" integer NOT NULL, "userId" bigint, CONSTRAINT "PK_ed1a52f63509c44fd690bdab6ec" PRIMARY KEY ("id"))`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "users" DROP COLUMN "role"`,
            undefined,
        );
        await queryRunner.query(
            `DROP TYPE "public"."users_role_enum"`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD "balance" integer NOT NULL DEFAULT 0`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD "accountNumber" character varying NOT NULL`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD "phone" character varying NOT NULL`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "client_request_log" ALTER COLUMN "created_at" SET DEFAULT now()`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "client_request_log" ALTER COLUMN "updated_at" SET DEFAULT now()`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "client_request_log" ALTER COLUMN "deleted_at" DROP DEFAULT`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now()`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now()`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "deleted_at" DROP DEFAULT`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "otp" ADD CONSTRAINT "FK_db724db1bc3d94ad5ba38518433" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "receiverlist" ADD CONSTRAINT "FK_e1e98a0c0c02cfcf19524b5bd3d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "saving_account" ADD CONSTRAINT "FK_9d83c16011deea09cea96e4d230" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "saving_account" DROP CONSTRAINT "FK_9d83c16011deea09cea96e4d230"`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "receiverlist" DROP CONSTRAINT "FK_e1e98a0c0c02cfcf19524b5bd3d"`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "otp" DROP CONSTRAINT "FK_db724db1bc3d94ad5ba38518433"`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "deleted_at" SET DEFAULT '2020-05-23 05:38:41.477558'`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2020-05-23 05:38:41.477558'`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2020-05-23 05:38:41.477558'`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "client_request_log" ALTER COLUMN "deleted_at" SET DEFAULT '2020-05-23 05:38:41.477558'`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "client_request_log" ALTER COLUMN "updated_at" SET DEFAULT '2020-05-23 05:38:41.477558'`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "client_request_log" ALTER COLUMN "created_at" SET DEFAULT '2020-05-23 05:38:41.477558'`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "users" DROP COLUMN "phone"`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "users" DROP COLUMN "accountNumber"`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "users" DROP COLUMN "balance"`,
            undefined,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'CUSTOMER', 'EMPLOYEE')`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD "role" "users_role_enum" NOT NULL`,
            undefined,
        );
        await queryRunner.query(`DROP TABLE "saving_account"`, undefined);
        await queryRunner.query(`DROP TABLE "transaction"`, undefined);
        await queryRunner.query(
            `DROP TYPE "transaction_banktype_enum"`,
            undefined,
        );
        await queryRunner.query(`DROP TABLE "receiverlist"`, undefined);
        await queryRunner.query(
            `DROP TYPE "receiverlist_banktype_enum"`,
            undefined,
        );
        await queryRunner.query(`DROP TABLE "otp"`, undefined);
        await queryRunner.query(`DROP TABLE "dept_remind"`, undefined);
        await queryRunner.query(`DROP TABLE "admin"`, undefined);
        await queryRunner.query(`DROP TYPE "admin_role_enum"`, undefined);
    }
}
