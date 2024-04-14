import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterChatEntity1713100096942 implements MigrationInterface {
    name = 'AlterChatEntity1713100096942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chat\` DROP COLUMN \`parent_id\``);
        await queryRunner.query(`ALTER TABLE \`chat\` ADD \`space_id\` binary(16) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`chat\` ADD \`previous_id\` binary(16) NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_4af4b7ce6939f782093abb178d\` ON \`chat\` (\`post_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_41e09a2d259a65bd784cd9bb56\` ON \`chat\` (\`author_id\`)`);
        await queryRunner.query(`ALTER TABLE \`chat\` ADD CONSTRAINT \`FK_b70cb8cd8b9630bac2699be3af6\` FOREIGN KEY (\`space_id\`) REFERENCES \`space\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chat\` DROP FOREIGN KEY \`FK_b70cb8cd8b9630bac2699be3af6\``);
        await queryRunner.query(`DROP INDEX \`IDX_41e09a2d259a65bd784cd9bb56\` ON \`chat\``);
        await queryRunner.query(`DROP INDEX \`IDX_4af4b7ce6939f782093abb178d\` ON \`chat\``);
        await queryRunner.query(`ALTER TABLE \`chat\` DROP COLUMN \`previous_id\``);
        await queryRunner.query(`ALTER TABLE \`chat\` DROP COLUMN \`space_id\``);
        await queryRunner.query(`ALTER TABLE \`chat\` ADD \`parent_id\` binary(16) NULL`);
    }

}
