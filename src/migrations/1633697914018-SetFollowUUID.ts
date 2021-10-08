import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetFollowUUID1633697914018 implements MigrationInterface {
  name = 'SetFollowUUID1633697914018';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "follows" DROP CONSTRAINT "PK_8988f607744e16ff79da3b8a627"`,
    );
    await queryRunner.query(`ALTER TABLE "follows" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "follows" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "follows" ADD CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "follows" DROP CONSTRAINT "PK_8988f607744e16ff79da3b8a627"`,
    );
    await queryRunner.query(`ALTER TABLE "follows" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "follows" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "follows" ADD CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id")`,
    );
  }
}
