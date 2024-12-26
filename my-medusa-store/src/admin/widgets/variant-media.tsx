import { defineWidgetConfig } from "@medusajs/admin-sdk";
import {
  DetailWidgetProps,
  AdminProductVariant,
} from "@medusajs/framework/types";
import { Container, Heading, Tooltip } from "@medusajs/ui";
import { useState, useEffect } from "react";
import { Media } from "../types";
import { EditMediaModal } from "../components/variant-media/edit-modal";
import { ThumbnailBadge } from "@medusajs/icons";

const VariantMediaWidget = ({
  data,
}: DetailWidgetProps<AdminProductVariant>) => {

  const [medias, setMedias] = useState<Media[]>([]);

  // Fetch medias for variant
  const fetchMedias = async () => {
    try {
        const res = await fetch(`/admin/variant-medias/variant/${data.id}`);
        if (!res.ok) {
            throw new Error("Failed to fetch medias");
        };
        const json: {medias: Media[]} = await res.json();
        const updatedMedias = json.medias.map((m: Media) => ({
            ...m,
        }));
        setMedias(updatedMedias);
    } catch (error) {
        console.error(error);
    }
  }

  useEffect(() => {
    fetchMedias();
  }, [data.id]);

  return (
    <>
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Media</Heading>
        <EditMediaModal variantId={data.id} medias={medias} setMedias={setMedias} />
      </div>
      {medias.length > 0 && (
        <div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-4 px-6 py-4">
                {medias.map((m) => (
                    <div key={m.file_id} className="shadow-elevation-card-rest hover:shadow-elevation-card-hover transition-fg group relative aspect-square size-full overflow-hidden rounded-[8px] cursor-pointer">
                        <img src={m.url} alt={m.name} className="size-full object-cover" />
                        {m.is_thumbnail && (
                            <div className="absolute left-2 top-2">
                              <Tooltip content="Thumbnail">
                                <ThumbnailBadge />
                              </Tooltip>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
      )}
    </Container>
    </>
  );
};

export const config = defineWidgetConfig({
    zone: 'product_variant.details.after',
});

export default VariantMediaWidget;
