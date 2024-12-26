import { Migration } from '@mikro-orm/migrations';

export class Migration20241219234252 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "media" ("id" text not null, "file_id" text not null, "size" integer not null, "name" text not null, "mime_type" text not null, "is_thumbnail" boolean not null default false, "url" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "media_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_media_file_id_unique" ON "media" (file_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_media_deleted_at" ON "media" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "media" cascade;');
  }

}
