export const getAllColors = async (supabase: App.Locals["supabase"]) => {
  try {
    const colors = await supabase.from("colors").select("*, budgets ( * )");
    return colors.data;
  } catch (e) {
    console.log(e);
  }
};
