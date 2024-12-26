import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';
import MediaModuleService from 'src/modules/media/service';
import { MEDIA_MODULE } from 'src/modules/media';

export type CreateMediaInput = {
    file_id: string;
    name: string;
    size: number;
    mime_type: string;
    is_thumbnail: boolean;
    url: string;
};

type CreateMediasInput = {
    medias: CreateMediaInput[];
};

const createMediasStep = createStep(
    'create-medias-step',
    async ({ medias }: CreateMediasInput, { container }) => {
        const mediaModuleService: MediaModuleService = container.resolve(MEDIA_MODULE);
        const createdMedias = await mediaModuleService.createMedia(medias);

        return new StepResponse({
            medias: createdMedias,
        }, {
            medias: createdMedias,
        });
    },
    async ({ medias }: any, { container }) => {
        const mediaModuleService: MediaModuleService = container.resolve(MEDIA_MODULE);
        await mediaModuleService.deleteMedia(medias.map((media) => media.id));
    },
);

export default createMediasStep;