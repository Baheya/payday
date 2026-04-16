import type { APIRoute } from "astro";

import { actions } from "astro:actions";

export const GET = (async (ctx) => {
  try {
    const { data, error } = await ctx.callAction(
      actions.categories.getAllCategories,
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
