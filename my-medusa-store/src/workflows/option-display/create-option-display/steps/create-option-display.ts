import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';
import OptionDisplayModuleService from 'src/modules/option-display/service';
import { OPTION_DISPLAY_MODULE } from 'src/modules/option-display';

export type CreateOptionDisplayInput = {
    option_id: string;
    option_title: string;
    option_values?: string[];
    display_type: 'buttons' | 'select' | 'images' | 'colors';
    colors?: string[];
};

const createOptionDisplayStep = createStep(
    'create-option-display-step',
    async (input: CreateOptionDisplayInput, { container }) => {
        const optionDisplayModuleService: OptionDisplayModuleService = container.resolve(OPTION_DISPLAY_MODULE);
        const createdOptionDisplay = await optionDisplayModuleService.createOptionDisplaies(input);

        return new StepResponse({
            option_display: createdOptionDisplay,
        }, {
            option_display: createdOptionDisplay,
        });
    },
    async ({ option_display }: any, { container }) => {
        const optionDisplayModuleService: OptionDisplayModuleService = container.resolve(OPTION_DISPLAY_MODULE);
        await optionDisplayModuleService.deleteOptionDisplaies(option_display.id);
    },
);

export default createOptionDisplayStep;