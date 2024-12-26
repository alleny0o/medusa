import OptionDisplayModule from '../modules/option-display';
import ProductModule from '@medusajs/medusa/product';
import { defineLink } from '@medusajs/framework/utils';

export default defineLink(
    ProductModule.linkable.product,
    {
        linkable: OptionDisplayModule.linkable.optionDisplay,
        isList: true,
        deleteCascade: true
    }
);