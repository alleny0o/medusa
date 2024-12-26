import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import getOptionDisplayStep from "./steps/get-option-display";

type GetOptionDisplayWorkflowInput = {
  option_id: string;
};

const getOptionDisplayWorkflow = createWorkflow(
  "get-option-display-workflow",
 (input: GetOptionDisplayWorkflowInput) => {
    const { option_display } =  getOptionDisplayStep(input);

    return new WorkflowResponse({
      option_display,
    });
  },
);