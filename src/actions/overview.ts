import { createSbClient } from "#lib/supabase.ts";
import { defineAction, type ActionReturnType } from "astro:actions";

interface RecurringBills {
  paid: number;
  future: number;
  dueSoon: number;
}

export const overview = {
  getOverview: defineAction({
    handler: async (_, { request, cookies }) => {
      try {
        const supabase = createSbClient({ request, cookies });
        const [
          balanceResponse,
          budgetsResponse,
          potsResponse,
          transactionsResponse,
          recurringBillsResponse,
        ] = await Promise.all([
          supabase.from("balance").select("*"),
          supabase.from("budgets").select("*"),
          supabase.from("pots").select("*, colors ( * )"),
          supabase.from("transactions").select("*").limit(5),
          supabase
            .from("transactions")
            .select("*, categories ( label )")
            .eq("recurring", true),
        ]);

        const initialValue: RecurringBills = { paid: 0, future: 0, dueSoon: 0 };

        const recurringBills = recurringBillsResponse.data?.reduce(
          (acc, bill) => {
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
          },
          initialValue,
        );

        return {
          balance: balanceResponse.data,
          budgets: budgetsResponse.data,
          pots: potsResponse.data,
          transactions: transactionsResponse.data,
          recurringBills,
        };
      } catch (e) {
        console.error(e);
      }
    },
  }),
};

export type GetOverview = ActionReturnType<typeof overview.getOverview>;
