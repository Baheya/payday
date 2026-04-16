import {
  publicBudgetsInsertSchema,
  type PublicBudgetsInsert,
} from "./schemas.ts";
import { PostgrestError } from "@supabase/supabase-js";
import { getPreviousMonthISOString } from "#lib/utils.ts";
import { ZodError } from "astro:schema";

export const getAllBudgets = async (locals: App.Locals) => {
  try {
    const response = await locals.supabase
      .from("budgets")
      .select("*, categories ( * ), colors ( * )");
    if (response.data && response.data.length > 0) {
      return response.data;
    }
  } catch (e) {
    console.log(e);
  }
};

export const getBudgetExpensesByCategory = async (locals: App.Locals) => {
  try {
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

        const currentBudgetsWithTransactions = currentBudgets.map((budget) => ({
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
        }));
        return currentBudgetsWithTransactions;
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export const addNewBudget = async (
  locals: App.Locals,
  budget: PublicBudgetsInsert,
) => {
  try {
    const validatedData = publicBudgetsInsertSchema.safeParse(budget);

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
};
