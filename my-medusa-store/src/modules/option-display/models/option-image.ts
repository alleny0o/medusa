import { model } from "@medusajs/framework/utils";
import OptionDisplay from "./option-display";

const Image = model.define("option_image", {
    id: model.id().primaryKey(),
    file_id: model.text().unique(),
    size: model.number(),
    name: model.text(),
    mime_type: model.text(),
    url: model.text(),
    option_display: model.belongsTo(() => OptionDisplay, {
        mappedBy: "images",
    }),
});

export default Image;