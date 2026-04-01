import { supabase } from "../lib/supabase.ts";

export const getOverview = async () => {
  try {
    const [
      balanceResponse,
      budgetsResponse,
      potsResponse,
      transactionsResponse,
    ] = await Promise.all([
      supabase.from("balance").select(),
      supabase.from("budgets").select(),
      supabase.from("pots").select(),
      supabase.from("transactions").select().limit(5),
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
