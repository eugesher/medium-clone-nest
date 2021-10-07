import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFavoritesRelationsBetweenArticleAndUser1633611808620
  implements MigrationInterface
{
  name = 'AddFavoritesRelationsBetweenArticleAndUser1633611808620';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_favorites_article" ("user_id" uuid NOT NULL, "article_id" uuid NOT NULL, CONSTRAINT "PK_cc7025d0bfc8357e6ecbed985d1" PRIMARY KEY ("user_id", "article_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e3b23f2013fb17b8ef2b636af0" ON "users_favorites_article" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fdfb895a67262f30a0a76b77f4" ON "users_favorites_article" ("article_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorites_article" ADD CONSTRAINT "FK_e3b23f2013fb17b8ef2b636af0b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorites_article" ADD CONSTRAINT "FK_fdfb895a67262f30a0a76b77f44" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_favorites_article" DROP CONSTRAINT "FK_fdfb895a67262f30a0a76b77f44"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorites_article" DROP CONSTRAINT "FK_e3b23f2013fb17b8ef2b636af0b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fdfb895a67262f30a0a76b77f4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e3b23f2013fb17b8ef2b636af0"`,
    );
    await queryRunner.query(`DROP TABLE "users_favorites_article"`);
  }
}
