import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import OptionDisplayModuleService from "src/modules/option-display/service";
import { OPTION_DISPLAY_MODULE } from "src/modules/option-display";

type GetOptionDisplayInput = {
    option_id: string;
};

const getOptionDisplayStep = createStep(
    "get-option-display-step",
    async (input: GetOptionDisplayInput, { container }) => {
        const optionDisplayModuleService: OptionDisplayModuleService = container.resolve(
            OPTION_DISPLAY_MODULE
        );
        const optionDisplays = await optionDisplayModuleService.listOptionDisplaies();

        const optionDisplay = optionDisplays.find(
            (optionDisplay) => optionDisplay.option_id === input.option_id
        );



        return new StepResponse(
            {
                option_display: optionDisplay,
            },
            {
                option_display: optionDisplay,
            }
        );
    },
    async ({ option_display }: any, { container }) => {
        const optionDisplayModuleService: OptionDisplayModuleService = container.resolve(
            OPTION_DISPLAY_MODULE
        );
        await optionDisplayModuleService.deleteOptionDisplaies(option_display.id);
    }
);

export default getOptionDisplayStep;