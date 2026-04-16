import { supabase } from "#lib/supabase.ts";
import { getPreviousMonthISOString } from "#lib/utils.ts";

const getAllBudgets = async () => {
  const response = await supabase.from("budgets").select();
  return response.data;
};

export const getBudgetExpensesOverview = async () => {
  const previousMonthDate = getPreviousMonthISOString();

  try {
    const currentMonthTransactions = await supabase
      .from("transactions")
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
        category_id: number;
        date: string;
        id: number;
        name: string;
        recurring: boolean;
        user_id: string;
        categories: {
          label: string;
        };
      }[]
    | undefined;
  category_id: number;
  id: number;
  maximum: number;
  theme_id: number;
  user_id: string;
}

export const getBudgetExpensesByCategory = async () => {
  try {
    const currentBudgets = await getAllBudgets();
    const previousMonthDate = getPreviousMonthISOString();
    const budgetIds = currentBudgets?.map((budget) => budget.category_id);

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
          ({ category_id }) => category_id,
        );

        const currentBudgetsWithTransactions = currentBudgets.map((budget) => ({
          ...budget,
          ...(transactionsGroupedByCategory[budget.category_id] && {
            transactions: transactionsGroupedByCategory[budget.category_id],
          }),
          totalSpent:
            transactionsGroupedByCategory[budget.category_id]?.reduce(
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
