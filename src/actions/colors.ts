import { defineAction, type ActionReturnType } from "astro:actions";

export const colors = {
  getAllColors: defineAction({
    handler: async (_, ctx) => {
      try {
        const colors = await ctx.locals.supabase
          .from("colors")
          .select("*, budgets ( * )");
        if (colors.data && colors.data.length > 0) {
          return colors.data;
        }
      } catch (e) {
        console.log(e);
      }
    },
  }),
};

export type GetAllColors = ActionReturnType<typeof colors.getAllColors>["data"];
