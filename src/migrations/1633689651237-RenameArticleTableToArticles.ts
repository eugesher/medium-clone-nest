import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameArticleTableToArticles1633689651237
  implements MigrationInterface
{
  name = 'RenameArticleTableToArticles1633689651237';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "articles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "body" character varying NOT NULL DEFAULT '', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tag_list" text NOT NULL, "favorites_count" integer NOT NULL DEFAULT '0', "author_id" uuid, CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_favorites_articles" ("user_id" uuid NOT NULL, "article_id" uuid NOT NULL, CONSTRAINT "PK_6bf19334b27b8bb42abcfc696e2" PRIMARY KEY ("user_id", "article_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a17814b4e8289774d257f70590" ON "users_favorites_articles" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bacfd8091e5c899a6ab2824bfb" ON "users_favorites_articles" ("article_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "articles" ADD CONSTRAINT "FK_6515da4dff8db423ce4eb841490" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorites_articles" ADD CONSTRAINT "FK_a17814b4e8289774d257f705900" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorites_articles" ADD CONSTRAINT "FK_bacfd8091e5c899a6ab2824bfb5" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_favorites_articles" DROP CONSTRAINT "FK_bacfd8091e5c899a6ab2824bfb5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorites_articles" DROP CONSTRAINT "FK_a17814b4e8289774d257f705900"`,
    );
    await queryRunner.query(
      `ALTER TABLE "articles" DROP CONSTRAINT "FK_6515da4dff8db423ce4eb841490"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bacfd8091e5c899a6ab2824bfb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a17814b4e8289774d257f70590"`,
    );
    await queryRunner.query(`DROP TABLE "users_favorites_articles"`);
    await queryRunner.query(`DROP TABLE "articles"`);
  }
}
