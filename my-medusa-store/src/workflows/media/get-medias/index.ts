import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import getMediasStep from "./steps/get-medias";

type GetMediasWorkflowInput = {
    media_ids: string[];
};

const getMediasWorkflow = createWorkflow(
    'get-medias',
    (input: GetMediasWorkflowInput) => {
        const { media_ids } = input;

        const { medias } = getMediasStep({ media_ids });

        return new WorkflowResponse({
            medias: medias,
        });
    },
);

export default getMediasWorkflow;