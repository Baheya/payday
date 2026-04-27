import type { APIRoute } from "astro";

import { actions } from "astro:actions";

export const POST: APIRoute = async ({ redirect, callAction }) => {
  const { data, error } = await callAction(actions.auth.signup, {});
  if (data?.ok) {
    return redirect("/signin");
  } else {
    return new Response(error?.message, { status: 500 });
  }
};
