import type { AstroCookies } from "astro";

import { createSbClient } from "#lib/supabase.ts";
import { getPreviousMonthISOString } from "#lib/utils.ts";
import {
  ActionError,
  defineAction,
  type ActionReturnType,
} from "astro:actions";
import { z } from "astro/zod";

export const budgets = {
  getBudgetExpensesByCategory: defineAction({
    handler: async (_, { request, cookies }) => {
      const currentBudgets = await getAllBudgets({ request, cookies });
      const previousMonthDate = getPreviousMonthISOString();
      const budgetIds = currentBudgets?.map((budget) => budget.category_id);
      const supabase = createSbClient({ request, cookies });

      if (budgetIds) {
        const currentMonthTransactions = await supabase
          .from("transactions")
          .select("*, categories ( label )")
          .in("category_id", budgetIds)
          .gte("date", previousMonthDate)
          .lte("date", new Date().toISOString())
          .order("date", { ascending: true });

        if (currentMonthTransactions.data && currentBudgets) {
          const transactionsGroupedByCategory = Object.groupBy(
            currentMonthTransactions.data,
            ({ categories }) => categories.label,
          );

          const currentBudgetsWithTransactions = currentBudgets.map(
            (budget) => ({
              ...budget,
              ...(transactionsGroupedByCategory[budget.categories.label] && {
                transactions:
                  transactionsGroupedByCategory[budget.categories.label],
              }),
              totalSpent:
                transactionsGroupedByCategory[budget.categories.label]?.reduce(
                  (total, acc) => {
                    return total + acc.amount;
                  },
                  0,
                ) || 0,
            }),
          );
          return currentBudgetsWithTransactions;
        }
      }
    },
  }),
  addNewBudget: defineAction({
    input: z.object({
      category_id: z.coerce.number(),
      theme_id: z.coerce.number(),
      maximum: z.coerce.number(),
    }),
    accept: "form",
    handler: async (input, { request, cookies }) => {
      try {
        const supabase = createSbClient({ request, cookies });
        const { data: userData, error: userError } =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          await supabase.auth.getUser();
        if (userError) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "User must be logged in.",
            stack: userError.stack,
          });
        }
        const inputWithUserId = { ...input, user_id: userData.user?.id };

        const { data, error } = await supabase
          .from("budgets")
          .insert([inputWithUserId])
          .select("*, categories ( label )");
        if (error) {
          console.error(error);
          throw error;
        }
        return data;
      } catch (error) {
        console.error(error);
      }
    },
  }),
  get: defineAction({
    input: z.object({
      category_id: z.number().optional(),
      budget_id: z.number().optional(),
      count: z.number().optional(),
    }),
    handler: async (input, { request, cookies }) => {
      const supabase = createSbClient({ request, cookies });
      let query = supabase.from("budgets").select("*");

      if (input.category_id) {
        query = query.in("category_id", [input.category_id]);
      }

      if (input.budget_id) {
        query = query.eq("id", input.budget_id);
      }

      if (input.count) {
        query = query.limit(input.count);
      }

      const { data, error } = await query;

      if (!error) {
        return data;
      }
    },
  }),
  editBudget: defineAction({
    input: z.object({
      category_id: z.coerce.number(),
      theme_id: z.coerce.number().optional(),
      maximum: z.coerce.number().optional(),
    }),
    accept: "form",
    handler: async (input, { request, cookies }) => {
      try {
        const supabase = createSbClient({ request, cookies });
        const { data: userData, error: userError } =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          await supabase.auth.getUser();
        if (userError) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "User must be logged in.",
            stack: userError.stack,
          });
        }
        const inputWithUserId = { ...input, user_id: userData.user?.id };

        const { data, error } = await supabase
          .from("budgets")
          .update([inputWithUserId])
          .eq("category_id", inputWithUserId.category_id)
          .select("*, categories ( label )");
        if (error) {
          console.error(error);
          throw error;
        }
        return data;
      } catch (error) {
        console.error(error);
      }
    },
  }),
  deleteBudget: defineAction({
    input: z.object({
      category_id: z.coerce.number(),
    }),
    accept: "form",
    handler: async (input, { request, cookies }) => {
      try {
        const supabase = createSbClient({ request, cookies });
        const { data: userData, error: userError } =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          await supabase.auth.getUser();
        if (userError) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "User must be logged in.",
            stack: userError.stack,
          });
        }
        const inputWithUserId = { ...input, user_id: userData.user?.id };

        const { data, error } = await supabase
          .from("budgets")
          .delete()
          .eq("category_id", inputWithUserId.category_id)
          .select("*, categories ( label )");
        if (error) {
          console.error(error);
          throw error;
        }
        return data;
      } catch (error) {
        console.error(error);
      }
    },
  }),
};

const getAllBudgets = async ({
  request,
  cookies,
}: {
  request: Request;
  cookies: AstroCookies;
}) => {
  try {
    const supabase = createSbClient({ request, cookies });
    const response = await supabase
      .from("budgets")
      .select("*, categories ( label ), colors ( label, value )");
    if (response.data && response.data.length > 0) {
      return response.data;
    }
  } catch (e) {
    console.log(e);
  }
};

export type GetBudgetExpensesByCategory = NonNullable<
  ActionReturnType<typeof budgets.getBudgetExpensesByCategory>["data"]
>;
export type GetBudgets = ActionReturnType<typeof budgets.get>;
