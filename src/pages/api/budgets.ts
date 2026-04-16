import type { APIRoute } from "astro";

import { actions } from "astro:actions";

export const GET = (async (ctx) => {
  try {
    const { data, error } = await ctx.callAction(
      actions.budgets.getBudgetExpensesByCategory,
      {},
    );

    if (!error) {
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (e) {
    console.log(e);
  }

  return new Response(
    JSON.stringify({
      message: "This was a GET!",
    }),
  );
}) satisfies APIRoute;

export const POST = (async ({ callAction, request }) => {
  try {
    const { data, error } = await callAction(
      actions.budgets.addNewBudget,
      await request.json(),
    );
    if (error) {
      throw error;
    }

    if (data) {
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (e) {
    console.log(e);
  }

  return new Response(
    JSON.stringify({
      message: "This was a GET!",
    }),
  );
}) satisfies APIRoute;
