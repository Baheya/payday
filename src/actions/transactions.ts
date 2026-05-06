import { createSbClient } from "#lib/supabase.ts";
import { defineAction, type ActionReturnType } from "astro:actions";
import { z } from "astro/zod";

export const transactions = {
  getTransactions: defineAction({
    input: z.object({
      pageNumber: z.number().default(1),
      category: z.string().optional(),
      sort: z.string().default("Latest"),
    }),
    handler: async (
      { pageNumber = 1, category, sort = "Latest" },
      { request, cookies },
    ) => {
      try {
        const transactionsPerPage = 10;
        const rangeStart =
          pageNumber * transactionsPerPage - transactionsPerPage;
        const rangeEnd = pageNumber * transactionsPerPage;
        const sortingColumnName =
          sort === "Latest" || sort === "Oldest"
            ? "date"
            : sort === "A to Z" || sort === "Z to A"
              ? "name"
              : "amount";
        const ascending =
          sort === "Oldest" || sort === "A to Z" || sort === "Highest"
            ? true
            : false;
        const supabase = createSbClient({ request, cookies });
        let query = supabase
          .from("transactions")
          .select("*, categories ( label )", { count: "exact" });

        if (category) {
          query = query.eq("category_id", parseInt(category));
        }

        if (sort) {
          query = query.order(sortingColumnName, { ascending });
        }

        if (pageNumber) {
          query = query.range(rangeStart, rangeEnd);
        }

        const { data, error, count } = await query;
        if (error) throw error;

        return { data, count };
      } catch (e) {
        console.error(e);
      }
    },
  }),
};

export type GetTransactions = ActionReturnType<
  typeof transactions.getTransactions
>;
