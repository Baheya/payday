import { supabase } from "./supabase.ts";

export const getOverview = async () => {
  try {
    const [
      balanceResponse,
      budgetResponse,
      potsResponse,
      transactionsResponse,
    ] = await Promise.all([
      supabase.from("Balance").select(),
      supabase.from("Budgets").select(),
      supabase.from("Pots").select(),
      supabase.from("Transactions").select(),
    ]);

    return {
      balance: balanceResponse.data,
      budget: budgetResponse.data,
      pots: potsResponse.data,
      transactions: transactionsResponse.data,
    };
  } catch (e) {
    console.log(e);
  }
};
