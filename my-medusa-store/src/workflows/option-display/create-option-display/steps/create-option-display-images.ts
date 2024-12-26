import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';
import OptionDisplayModuleService from 'src/modules/option-display/service';
import { OPTION_DISPLAY_MODULE } from 'src/modules/option-display';

export type Image = {
    file_id: string;
    size: number;
    name: string;
    mime_type: string;
    url: string;
    option_display_id: string;
}

type CreateOptionDisplayImagesInput = {
    images: Image[];
};

const createOptionDisplayImagesStep = createStep(
    'create-option-display-images-step',
    async ({ images }: CreateOptionDisplayImagesInput, { container }) => {
        const optionDisplayModuleService: OptionDisplayModuleService = container.resolve(OPTION_DISPLAY_MODULE);
        const createdImages = await optionDisplayModuleService.createImages(images);

        return new StepResponse({
            option_display_images: createdImages,
        }, {
            option_display_images: createdImages,
        });
    },
    async ({ option_display_images }: any, { container }) => {
        const optionDisplayModuleService: OptionDisplayModuleService = container.resolve(OPTION_DISPLAY_MODULE);
        await optionDisplayModuleService.deleteImages(option_display_images.map((image) => image.id));
    },
);

export default createOptionDisplayImagesStep;