import { Migration } from '@mikro-orm/migrations';

export class Migration20241226200616 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "option_display" ("id" text not null, "option_id" text not null, "option_title" text not null, "option_values" text[] null, "display_type" text check ("display_type" in (\'buttons\', \'select\', \'images\', \'colors\')) not null default \'buttons\', "colors" text[] null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "option_display_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_option_display_option_id_unique" ON "option_display" (option_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_option_display_deleted_at" ON "option_display" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "option_image" ("id" text not null, "file_id" text not null, "size" integer not null, "name" text not null, "mime_type" text not null, "url" text not null, "option_display_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "option_image_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_option_image_file_id_unique" ON "option_image" (file_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_option_image_option_display_id" ON "option_image" (option_display_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_option_image_deleted_at" ON "option_image" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('alter table if exists "option_image" add constraint "option_image_option_display_id_foreign" foreign key ("option_display_id") references "option_display" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "option_image" drop constraint if exists "option_image_option_display_id_foreign";');

    this.addSql('drop table if exists "option_display" cascade;');

    this.addSql('drop table if exists "option_image" cascade;');
  }

}
