import { supabase } from "../lib/supabase.ts";

export const getTransactions = async () => {
  const response = await supabase.from("Transactions").select();
  return response.data;
};

export interface RecurringBills {
  paid: number;
  future: number;
  dueSoon: number;
}

export const getRecurringBillsOverview = async () => {
  const response = await supabase
    .from("Transactions")
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
};
