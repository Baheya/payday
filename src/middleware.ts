import { createSbClient } from "#lib/supabase.ts";
import { defineMiddleware } from "astro:middleware";

// // `context` and `next` are automatically typed
export const onRequest = defineMiddleware(async (context, next) => {
  const supabase = createSbClient({
    request: context.request,
    cookies: context.cookies,
  });
  const { data } = await supabase.auth.getUser();

  const authPagePaths = [
    "/signin",
    "/signup",
    "/api/auth/signin",
    "/api/auth/signup",
    "/api/auth/confirm",
  ];
  if (!data.user && !authPagePaths.includes(context.url.pathname)) {
    return context.redirect("/signin");
  }
  return next();
});
