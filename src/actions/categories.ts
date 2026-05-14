import { createSbClient } from "#lib/supabase.ts";
import { defineAction, type ActionReturnType } from "astro:actions";

export const categories = {
  getAllCategories: defineAction({
    handler: async (_, { request, cookies }) => {
      try {
        const supabase = createSbClient({ request, cookies });
        const { data, error } = await supabase
          .from("categories")
          .select("*, budgets ( category_id )");
        if (!error) {
          return data;
        }
      } catch (e) {
        console.error(e);
      }
    },
  }),
};

export type GetAllCategories = NonNullable<
  ActionReturnType<typeof categories.getAllCategories>["data"]
>;
