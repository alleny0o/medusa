import { createWorkflow, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import createMediasStep, { CreateMediaInput } from './steps/create-medias';
import createRemoteLinkStep from './steps/create-link';

type CreateMediasWorkflowInput = {
    medias: CreateMediaInput[];
    variant_id: string;
};

const createMediasWorkflow = createWorkflow(
    'create-medias',
    (input: CreateMediasWorkflowInput) => {
        const {medias, variant_id } = input;

        const { medias: createdMedias } = createMediasStep({ medias });

        createRemoteLinkStep({ medias: createdMedias, variant_id });

        return new WorkflowResponse({
            medias: createdMedias,
        });
    },
);

export default createMediasWorkflow;