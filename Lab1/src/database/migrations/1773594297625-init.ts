import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1773594297625 implements MigrationInterface {
  name = 'Init1773594297625';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`notes\` (\`id\` uuid NOT NULL, \`title\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`notes\``);
  }
}
