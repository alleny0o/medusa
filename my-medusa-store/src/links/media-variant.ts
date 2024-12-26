import MediaModule from '../modules/media';
import ProductModule from '@medusajs/medusa/product';
import { defineLink } from '@medusajs/framework/utils';

export default defineLink(
    ProductModule.linkable.productVariant,
    {
        linkable: MediaModule.linkable.media,
        isList: true,
        deleteCascade: true,
    },
);