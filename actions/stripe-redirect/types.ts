import { ActionState } from "../../lib/create-safe-action";
import { z } from "zod";
import { StripeRedict } from "./schema";

export type InputType = z.infer<typeof StripeRedict>;
export type ReturnType = ActionState<InputType, string>;
