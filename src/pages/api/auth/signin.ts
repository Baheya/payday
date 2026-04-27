import type { APIRoute } from "astro";

import { actions } from "astro:actions";

export const POST: APIRoute = async ({ redirect, callAction }) => {
  const { error } = await callAction(actions.auth.signin, {});

  if (error) {
    return new Response(error.message, { status: 500 });
  }
  return redirect("/");
};
