import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1681483943183 implements MigrationInterface {
  name = 'InitDatabase1681483943183';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category" ("id" character varying NOT NULL, "slug" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL, CONSTRAINT "UQ_cb73208f151aa71cdd78f662d70" UNIQUE ("slug"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
