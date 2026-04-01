import { supabase } from "../lib/supabase.ts";

export const getTransactions = async (
  pageNumber: number = 1,
  category?: string,
  sort: string = "Latest",
) => {
  try {
    const transactionsPerPage = 10;
    const rangeStart = pageNumber * transactionsPerPage - transactionsPerPage;
    const rangeEnd = pageNumber * transactionsPerPage;
    const sortingColumnName =
      sort === "Latest" || sort === "Oldest"
        ? "date"
        : sort === "A to Z" || sort === "Z to A"
          ? "name"
          : "amount";
    const ascending =
      sort === "Oldest" || sort === "A to Z" || sort === "Highest"
        ? true
        : false;
    let query = supabase.from("transactions").select("*", { count: "exact" });

    if (category) {
      query = query.eq("category", category);
    }

    if (sort) {
      query = query.order(sortingColumnName, { ascending });
    }

    if (pageNumber) {
      query = query.range(rangeStart, rangeEnd);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return { data, count };
  } catch (e) {
    console.log(e);
  }
};

export const getAllTransactionCategories = async () => {
  try {
    const response = await supabase.from("transactions").select("category");
    return { data: response.data };
  } catch (e) {
    console.log(e);
  }
};

export interface RecurringBills {
  paid: number;
  future: number;
  dueSoon: number;
}

export const getRecurringBillsOverview = async () => {
  try {
    const response = await supabase
      .from("transactions")
      .select()
      .eq("recurring", true);
    const initialValue: RecurringBills = { paid: 0, future: 0, dueSoon: 0 };

    const recurringBills = response.data?.reduce((acc, bill) => {
      const currentDay = new Date(Date.now()).getDate();
      const billDueDateDay = new Date(bill.date).getDate();
      const dayDifference = billDueDateDay - currentDay;
      const week = 7;

      if (dayDifference < week && dayDifference > 0) {
        acc.dueSoon += bill.amount;
      } else if (dayDifference > week) {
        acc.future += bill.amount;
      } else {
        acc.paid += bill.amount;
      }
      return acc;
    }, initialValue);
    return recurringBills;
  } catch (e) {
    console.log(e);
  }
};
