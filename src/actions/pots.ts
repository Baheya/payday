import { createSbClient } from "#lib/supabase.ts";
import { defineAction } from "astro:actions";

export const pots = {
  getAllPots: defineAction({
    handler: async (__dirname, { request, cookies }) => {
      try {
        const supabase = createSbClient({ request, cookies });

        const { data, error } = await supabase
          .from("pots")
          .select("*, colors ( * )");

        if (!error) {
          return data;
        }
      } catch (e) {
        console.error(e);
      }
    },
  }),
};
