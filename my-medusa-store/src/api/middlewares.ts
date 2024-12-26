import { defineMiddlewares } from "@medusajs/medusa";
import { validateAndTransformBody } from "@medusajs/framework";
import { createMediasSchema, deleteFilesSchema } from "./validation-schemas";

import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage()});

export default defineMiddlewares({
    routes: [
        {
            matcher: '/admin/variant-medias',
            method: 'POST',
            middlewares: [
                validateAndTransformBody(createMediasSchema),
            ],
        },
        {
            matcher: '/admin/variant-medias/upload',
            method: 'DELETE',
            middlewares: [
                validateAndTransformBody(deleteFilesSchema),
            ],
        },
        {
            matcher: '/admin/variant-medias/upload',
            method: 'POST',
            middlewares: [
                upload.array('files'),
            ],
        }
    ]
})