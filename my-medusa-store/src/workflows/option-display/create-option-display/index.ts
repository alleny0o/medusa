import {
  createWorkflow,
  when,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows";
import { Modules } from "@medusajs/framework/utils";
import createOptionDisplayStep, {
  CreateOptionDisplayInput,
} from "./steps/create-option-display";
import createOptionDisplayImagesStep, {
  Image,
} from "./steps/create-option-display-images";
import { OPTION_DISPLAY_MODULE } from "src/modules/option-display";

type CreateOptionDisplayWorkflowInput = {
  option_display: CreateOptionDisplayInput & {
    images: Omit<Image, "option_display_id">[];
  };
  product_id: string;
};

const createOptionDisplayWorkflow = createWorkflow(
  "create-option-display-workflow",
  (input: CreateOptionDisplayWorkflowInput) => {
    const { images, ...optionDisplayData } = input.option_display;
    const { option_display } = createOptionDisplayStep(optionDisplayData);

    const optionDisplayImagesResult = when(
      images,
      (images) => !!images && images.length > 0
    ).then(() => {
      return createOptionDisplayImagesStep(
        transform(
          {
            images,
            option_display,
          },
          (data) => ({
            images: data.images.map((image) => ({
              ...image,
              option_display_id: data.option_display.id,
            })),
          })
        )
      );
    });

    const option_display_images =
      optionDisplayImagesResult?.option_display_images;

    createRemoteLinkStep([
      {
        [Modules.PRODUCT]: {
          product_id: input.product_id,
        },
        [OPTION_DISPLAY_MODULE]: {
          option_display_id: option_display.id,
        },
      },
    ]);
    return new WorkflowResponse({
      option_display: {
        ...option_display,
        images: option_display_images?.option_display_images || [],
      },
    });
  }
);

export default createOptionDisplayWorkflow;