import { createSbClient } from "#lib/supabase.ts";
import { defineAction, type ActionReturnType } from "astro:actions";

export const categories = {
  getAllCategories: defineAction({
    handler: async (_, { request, cookies }) => {
      try {
        const supabase = createSbClient({ request, cookies });
        const categories = await supabase
          .from("categories")
          .select("*, budgets ( category_id )");
        if (categories.data && categories.data.length > 0) {
          return categories.data;
        }
      } catch (e) {
        console.error(e);
      }
    },
  }),
};

export type GetAllCategories = ActionReturnType<
  typeof categories.getAllCategories
>["data"];
