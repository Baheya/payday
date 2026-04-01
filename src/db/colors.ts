import { supabase } from "#lib/supabase.ts";

export const getAllColors = async () => {
  try {
    const colors = await supabase.from("colors").select("*");
    if (colors.data && colors.data.length > 0) {
      return colors.data;
    }
  } catch (e) {
    console.log(e);
  }
};
