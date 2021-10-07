import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelationsBetweenArticleAndUser1633597408467
  implements MigrationInterface
{
  name = 'AddRelationsBetweenArticleAndUser1633597408467';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "article" ADD "author_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "article" ADD CONSTRAINT "FK_16d4ce4c84bd9b8562c6f396262" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "article" DROP CONSTRAINT "FK_16d4ce4c84bd9b8562c6f396262"`,
    );
    await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "author_id"`);
  }
}
