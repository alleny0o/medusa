import { MedusaService } from "@medusajs/framework/utils";
import OptionDisplay from "./models/option-display";
import Image from "./models/option-image";

class OptionDisplayModuleService extends MedusaService({
    OptionDisplay,
    Image,
}) {};

export default OptionDisplayModuleService;