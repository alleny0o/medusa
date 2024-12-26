import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import MediaModuleService from "src/modules/media/service";
import { MEDIA_MODULE } from "src/modules/media";

type GetMediasInput = {
    media_ids: string[];
};

const getMediasStep = createStep(
    'get-medias-step',
    async ({ media_ids }: GetMediasInput, { container }) => {
        const mediaModuleService: MediaModuleService = container.resolve(MEDIA_MODULE);
        
        const medias = await mediaModuleService.listMedia({
            id: media_ids
        });

        return new StepResponse({
            medias: medias,
        });
    },
);

export default getMediasStep;