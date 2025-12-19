import { supabase } from "../lib/supabase.ts";

export const getTransactions = async () => {
  const response = await supabase.from("Transactions").select();
  return response.data;
};
