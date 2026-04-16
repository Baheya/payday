import { defineAction, type ActionReturnType } from "astro:actions";

export const categories = {
  getAllCategories: defineAction({
    handler: async (_, ctx) => {
      try {
        const categories = await ctx.locals.supabase
          .from("categories")
          .select("*, budgets ( category_id )");
        if (categories.data && categories.data.length > 0) {
          return categories.data;
        }
      } catch (e) {
        console.log(e);
      }
    },
  }),
};

export type GetAllCategories = ActionReturnType<
  typeof categories.getAllCategories
>;
