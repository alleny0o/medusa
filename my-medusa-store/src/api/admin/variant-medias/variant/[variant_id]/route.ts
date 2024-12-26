import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

// GET all medias for a variant by variant id
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const variant_id = req.params.variant_id;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: linkResults } = await query.graph({
    entity: "product_variant",
    fields: ["media.*"],
    filters: {
      id: variant_id,
    },
  });

  const mediaResults = linkResults[0].media;

  res.json({
    medias: mediaResults?.map((m) => {
      if (!m) return null;
      return {
        id: m.id,
        file_id: m.file_id,
        url: m.url,
        mime_type: m.mime_type,
        is_thumbnail: m.is_thumbnail,
        name: m.name,
        size: m.size,
      };
    }).filter(Boolean),
  });
};

import deleteMediasWorkflow from "src/workflows/media/delete-medias";
import { RemoteLink } from "@medusajs/framework/modules-sdk";
import { LinkDefinition } from "@medusajs/framework/types";
import { MEDIA_MODULE } from "src/modules/media";

// DELETE all medias for a variant by variant id
export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) => {
  const variant_id = req.params.variant_id;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const remoteLink: RemoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK);


  try {
    const { data: linkResults } = await query.graph({
      entity: "product_variant",
      fields: ["media.*"],
      filters: {
        id: variant_id,
      },
    });

    const mediaResults = linkResults[0].media;
    // const file_ids = mediaResults?.filter((m) => m !== null).map((m) => m.file_id) || [];
    const media_ids = mediaResults?.filter((m) => m !== null).map((m) => m.id) || [];

    // await deleteFilesWorkflow(req.scope).run({
    //   input: {
    //     ids: file_ids,
    //   },
    // });

    await deleteMediasWorkflow(req.scope).run({
      input: {
        media_ids: media_ids,
      },
    });

    const links: LinkDefinition[] = [];

    for (const media_id of media_ids) {
      links.push({
        [Modules.PRODUCT]: {
          product_variant_id: variant_id,
        },
        [MEDIA_MODULE]: {
          media_id: media_id,
        },
      });
    };

    await remoteLink.dismiss(links);

    res.json({
      success: true,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  };
};