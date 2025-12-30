import { supabase } from "#lib/supabase.ts";
import { getPreviousMonthISOString } from "#lib/utils.ts";

export interface BudgetExpenseOverview {
  total: number;
  budgetExpenses: Array<{ total: number; category: string }>;
}

export const getBudgets = async () => {
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

export const getBudgetExpenses = async () => {
  const previousMonthDate = getPreviousMonthISOString();

  try {
    const budgets = await getBudgets();
    const budgetCategories = budgets?.map((budget) => budget.category);

    if (budgetCategories) {
      const currentMonthTransactions = await supabase
        .from("Transactions")
        .select()
        .in("category", budgetCategories)
        .gte("date", previousMonthDate)
        .lte("date", new Date().toISOString());

      const budgetOverview: BudgetExpenseOverview = {
        total: 0,
        budgetExpenses: [],
      };

      if (
        currentMonthTransactions.data &&
        currentMonthTransactions.data.length > 0
      ) {
        const totalSpentFromBudget = currentMonthTransactions.data?.reduce(
          (acc, transaction) => {
            const isExpense = transaction.amount.toString().includes("-");
            const budget = acc.budgetExpenses.find(
              (budget) => budget.category === transaction.category,
            );
            const budgetExists = !!budget;

            if (budgetExists && isExpense) {
              budget.total = budget.total + transaction.amount;
              acc.total = acc.total + transaction.amount;
              return acc;
            } else if (!budgetExists && isExpense) {
              acc.budgetExpenses.push({
                total: transaction.amount,
                category: transaction.category,
              });
              acc.total = acc.total + transaction.amount;
              return acc;
            } else {
              return acc;
            }
          },
          budgetOverview,
        );

        return totalSpentFromBudget;
      }
    }
  } catch (e) {
    console.log(e);
  }
};
