import { model } from "@medusajs/framework/utils";

const Media = model.define("media", {
    id: model.id().primaryKey(),
    file_id: model.text().unique(),
    size: model.number(),
    name: model.text(),
    mime_type: model.text(),
    is_thumbnail: model.boolean().default(false),
    url: model.text(),
});

export default Media;