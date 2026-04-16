import type { APIRoute } from "astro";

import { actions } from "astro:actions";

export const GET = (async ({ callAction, request }) => {
  try {
    const searchParams = new URL(request.url).searchParams;
    const pageNumber = parseInt(searchParams.get("page") || "1");
    const category = decodeURI(searchParams.get("filter") || "");
    const sort = decodeURI(searchParams.get("sort") || "Latest");
    const { data, error } = await callAction(
      actions.transactions.getTransactions,
      { pageNumber, category, sort },
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
