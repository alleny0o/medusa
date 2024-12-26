import { z } from 'zod';
import createMediasWorkflow from 'src/workflows/media/create-medias';
import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { createMediasSchema } from 'src/api/validation-schemas';
import { CreateMediaInput } from 'src/workflows/media/create-medias/steps/create-medias';

type CreateRequestBody = z.infer<typeof createMediasSchema>;

// Create new medias
export const POST = async (
    req: AuthenticatedMedusaRequest<CreateRequestBody>,
    res: MedusaResponse,
) => {
    const { result } = await createMediasWorkflow(
        req.scope,
    ).run({
        input: {
            medias: req.validatedBody.medias.map((media) => ({
                file_id: media.file_id,
                name: media.name,
                size: media.size,
                mime_type: media.mime_type,
                is_thumbnail: media.is_thumbnail,
                url: media.url,
            })) as CreateMediaInput[],
            variant_id: req.validatedBody.variant_id,
        }
    });

    res.status(200).json({ medias: result.medias });
}