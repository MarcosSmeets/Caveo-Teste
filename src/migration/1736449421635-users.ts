import { MigrationInterface, QueryRunner } from "typeorm";

export class Users1736449421635 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user" (
            "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            "name" VARCHAR NOT NULL,
            "email" VARCHAR NOT NULL UNIQUE,
            "role" VARCHAR NOT NULL,
            "isOnboarded" BOOLEAN DEFAULT false,
            "createdAt" TIMESTAMP DEFAULT now(),
            "updatedAt" TIMESTAMP DEFAULT now(),
            "deletedAt" TIMESTAMP
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE users;`);
  }
}
