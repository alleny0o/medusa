import MediaModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const MEDIA_MODULE = "mediaModuleService";

export default Module(MEDIA_MODULE, {
    service: MediaModuleService,
});