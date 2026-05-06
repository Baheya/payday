import { createSbClient } from "#lib/supabase.ts";
import { defineAction, type ActionReturnType } from "astro:actions";

export const colors = {
  getAllColors: defineAction({
    handler: async (_, { request, cookies }) => {
      try {
        const supabase = createSbClient({ request, cookies });
        const colors = await supabase.from("colors").select("*, budgets ( * )");
        if (colors.data && colors.data.length > 0) {
          return colors.data;
        }
      } catch (e) {
        console.error(e);
      }
    },
  }),
};

export type GetAllColors = ActionReturnType<typeof colors.getAllColors>["data"];
