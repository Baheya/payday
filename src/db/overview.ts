import { supabase } from "../lib/supabase.ts";

export const getOverview = async () => {
  try {
    const [
      balanceResponse,
      budgetsResponse,
      potsResponse,
      transactionsResponse,
    ] = await Promise.all([
      supabase.from("Balance").select(),
      supabase.from("Budgets").select(),
      supabase.from("Pots").select(),
      supabase.from("Transactions").select().limit(5),
    ]);

    return {
      balance: balanceResponse.data,
      budgets: budgetsResponse.data,
      pots: potsResponse.data,
      transactions: transactionsResponse.data,
    };
  } catch (e) {
    console.log(e);
  }
};
