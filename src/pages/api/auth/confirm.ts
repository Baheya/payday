import { type APIRoute } from "astro";
import { actions } from "astro:actions";

export const GET: APIRoute = async ({ request, redirect, callAction }) => {
  const { error } = await callAction(actions.auth.confirm, {});
  const requestUrl = new URL(request.url);
  const next = requestUrl.searchParams.get("next") || "/";

  // return the user to an error page with some instructions
  if (error) {
    return redirect("/auth/auth-code-error");
  }

  return new Response(next, { status: 200 });
};
