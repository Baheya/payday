import type { Database } from "#src/types.ts";

import { supabase } from "#lib/supabase.ts";
import { getPreviousMonthISOString } from "#lib/utils.ts";

const getAllBudgets = async () => {
  const response = await supabase.from("Budgets").select();
  return response.data;
};

export const getBudgetExpensesOverview = async () => {
  const previousMonthDate = getPreviousMonthISOString();

  try {
    const currentMonthTransactions = await supabase
      .from("Transactions")
      .select()
      .gte("date", previousMonthDate)
      .lte("date", new Date().toISOString());

    if (
      currentMonthTransactions.data &&
      currentMonthTransactions.data.length > 0
    ) {
      const expenseTransactions = currentMonthTransactions.data.filter(
        (transaction) => transaction.amount.toString().includes("-"),
      );
      const budgetExpenseTotal = expenseTransactions.reduce(
        (acc, transaction) => {
          acc.total = acc.total + transaction.amount;
          return acc;
        },
        { total: 0 },
      );
      return budgetExpenseTotal;
    }
  } catch (e) {
    console.log(e);
  }
};

export interface BudgetExpensesByCategory {
  totalSpent: number;
  transactions?:
    | {
        amount: number;
        avatar: string;
        category: string;
        date: string;
        id: number;
        name: string;
        recurring: boolean;
      }[]
    | undefined;
  category: string;
  id: number;
  maximum: number;
  theme: Database["public"]["Enums"]["theme"];
}

export const getBudgetExpensesByCategory = async () => {
  try {
    const currentBudgets = await getAllBudgets();
    const previousMonthDate = getPreviousMonthISOString();
    const budgetCategories = currentBudgets?.map((budget) => budget.category);

    if (budgetCategories) {
      const currentMonthTransactions = await supabase
        .from("Transactions")
        .select("*")
        .in("category", budgetCategories)
        .gte("date", previousMonthDate)
        .lte("date", new Date().toISOString())
        .order("date", { ascending: true });

      if (currentMonthTransactions.data && currentBudgets) {
        const transactionsGroupedByCategory = Object.groupBy(
          currentMonthTransactions.data,
          ({ category }) => category,
        );

        const currentBudgetsWithTransactions = currentBudgets.map((budget) => ({
          ...budget,
          ...(transactionsGroupedByCategory[budget.category] && {
            transactions: transactionsGroupedByCategory[budget.category],
          }),
          totalSpent:
            transactionsGroupedByCategory[budget.category]?.reduce(
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
