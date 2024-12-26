import { createWorkflow, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import deleteMediasStep from './steps/delete-medias';

type DeleteMediasWorkflowInput = {
    media_ids: string[];
};

const deleteMediasWorkflow = createWorkflow(
    'delete-medias',
    (input: DeleteMediasWorkflowInput) => {
        const { media_ids } = input;

        const { deletedMedias } = deleteMediasStep({ media_ids });

        return new WorkflowResponse({
            deleted_medias: deletedMedias,
        });
    },
);

export default deleteMediasWorkflow;