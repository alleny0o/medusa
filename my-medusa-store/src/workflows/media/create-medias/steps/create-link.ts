import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';
import { CreateMediaInput } from './create-medias';
import { MEDIA_MODULE } from 'src/modules/media';
import { LinkDefinition } from '@medusajs/framework/types';
import { Modules } from '@medusajs/framework/utils';

export type CreateLinkInput = {
    medias: (CreateMediaInput & {id: string})[];
    variant_id: string;
};

const createRemoteLinkStep = createStep(
    'create-remote-link-step',
    async ({ medias, variant_id}: CreateLinkInput, { container }) => {
        const remoteLink = container.resolve('remoteLink');
        const links: LinkDefinition[] = [];

        for (const media of medias) {
            links.push({
                [Modules.PRODUCT]: {
                    product_variant_id: variant_id,
                },
                [MEDIA_MODULE]: {
                    media_id: media.id,
                },
            });
        };

        await remoteLink.create(links);

        return new StepResponse(links, links);
    },
    async (links, { container }) => {
        if (!links?.length) return;

        const remoteLink = container.resolve('remoteLink');
        await remoteLink.dismiss(links);
    },
);

export default createRemoteLinkStep;