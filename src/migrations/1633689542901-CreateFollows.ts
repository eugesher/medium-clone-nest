import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFollows1633689542901 implements MigrationInterface {
  name = 'CreateFollows1633689542901';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "follows" ("id" SERIAL NOT NULL, "follower_id" character varying NOT NULL, "following_id" character varying NOT NULL, CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "follows"`);
  }
}
