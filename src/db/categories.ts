import { supabase } from "#lib/supabase.ts";

export const getAllCategories = async () => {
  try {
    const categories = await supabase
      .from("categories")
      .select("*, budgets ( category )");
    if (categories.data && categories.data.length > 0) {
      return categories.data;
    }
  } catch (e) {
    console.log(e);
  }
};
