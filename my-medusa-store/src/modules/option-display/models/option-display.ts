import { model } from "@medusajs/framework/utils";
import Image from "./option-image";

const OptionDisplay = model.define("option_display", {
    id: model.id().primaryKey(),
    option_id: model.text().unique(),
    option_title: model.text(),
    option_values: model.array().nullable(),
    display_type: model.enum(["buttons", "select", "images", "colors"]).default("buttons"),
    images: model.hasMany(() => Image, {
        mappedBy: "option_display",
    }),
    colors: model.array().nullable(),
}).cascades({
    delete: ["images"],
});

export default OptionDisplay;