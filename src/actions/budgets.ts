import { publicBudgetsInsertSchema } from "../db/schemas.ts";
import { PostgrestError } from "@supabase/supabase-js";
import { getPreviousMonthISOString } from "#lib/utils.ts";
import { defineAction, type ActionReturnType } from "astro:actions";
import { z, ZodError } from "astro/zod";

export const budgets = {
  getBudgetExpensesByCategory: defineAction({
    handler: async (_, { locals }) => {
      const currentBudgets = await getAllBudgets(locals);
      const previousMonthDate = getPreviousMonthISOString();
      const budgetIds = currentBudgets?.map((budget) => budget.category_id);

      if (budgetIds) {
        const currentMonthTransactions = await locals.supabase
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
    // input: publicBudgetsInsertSchema,
    handler: async (input: { [k: string]: unknown }, { locals }) => {
      try {
        const validatedData = publicBudgetsInsertSchema.safeParse(input);

        if (validatedData.success) {
          const { data, error } = await locals.supabase
            .from("budgets")
            .insert([validatedData.data])
            .select();
          if (error) throw error;
          if (data) {
            return data;
          }
        }
      } catch (e) {
        if (e instanceof ZodError) {
          console.log(e);
        } else if (e instanceof PostgrestError) {
          console.log(e);
        }
      }
    },
  }),
  get: defineAction({
    input: z.object({
      category_id: z.number().optional(),
      budget_id: z.number().optional(),
      count: z.number().optional(),
    }),
    handler: async (input, ctx) => {
      let query = ctx.locals.supabase.from("budgets").select("*");

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
};

const getAllBudgets = async (locals: App.Locals) => {
  try {
    const response = await locals.supabase
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
