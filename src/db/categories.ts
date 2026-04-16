export const getAllCategories = async (supabase: App.Locals["supabase"]) => {
  try {
    const categories = await supabase
      .from("categories")
      .select("*, budgets ( * )");
    if (categories.data && categories.data.length > 0) {
      return categories.data;
    }
  } catch (e) {
    console.log(e);
  }
};

export type GetAllCategories = NonNullable<
  Awaited<ReturnType<typeof getAllCategories>>
>;
