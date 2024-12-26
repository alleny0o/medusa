import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import MediaModuleService from "src/modules/media/service"; 
import { MEDIA_MODULE } from "src/modules/media";

type DeleteMediasInput = {
    media_ids: string[];
};

const deleteMediasStep = createStep(
    'delete-medias-step',
    async ({ media_ids }: DeleteMediasInput, { container }) => {
        const mediaModuleService: MediaModuleService = container.resolve(MEDIA_MODULE);
        
        const mediaToDelete = await mediaModuleService.listMedia({
            id: media_ids
        });

        await mediaModuleService.deleteMedia(media_ids);

        return new StepResponse({
            deletedMedias: mediaToDelete,
        }, {
            deletedMedias: mediaToDelete,
        });
    },
    async ({ deletedMedias }: any, { container }) => {
        const mediaModuleService: MediaModuleService = container.resolve(MEDIA_MODULE);
        await mediaModuleService.createMedia(deletedMedias);
    },
);

export default deleteMediasStep;