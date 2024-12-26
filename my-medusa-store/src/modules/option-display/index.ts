import OptionDisplayModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const OPTION_DISPLAY_MODULE = "optionDisplayModuleService";

export default Module(OPTION_DISPLAY_MODULE, {
    service: OptionDisplayModuleService,
});