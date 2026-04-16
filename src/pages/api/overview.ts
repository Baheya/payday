import type { APIRoute } from "astro";

import { actions } from "astro:actions";

export const GET = (async ({ callAction }) => {
  try {
    const { data, error } = await callAction(actions.overview.getOverview, {});
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
