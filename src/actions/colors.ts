import { createSbClient } from "#lib/supabase.ts";
import {
  ActionError,
  defineAction,
  type ActionReturnType,
} from "astro:actions";

export const colors = {
  getAllColors: defineAction({
    handler: async (_input, { request, cookies }) => {
      const supabase = createSbClient({ request, cookies });
      const { data, error } = await supabase
        .from("colors")
        .select("*, budgets ( * )");
      if (error) {
        throw new ActionError<typeof error>({
          message: error.message,
          code: "BAD_GATEWAY",
        });
      }
      return data;
    },
  }),
};

export type GetAllColors = ActionReturnType<typeof colors.getAllColors>;
