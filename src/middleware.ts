import type {
  CookieMethodsServer,
  CookieOptions,
} from "@supabase/ssr/dist/main/types.js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#db/types.ts";

import { createServerClient } from "@supabase/ssr/dist/main/createServerClient.js";
import {
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr/dist/main/utils/helpers.js";
import { defineMiddleware } from "astro:middleware";

// // `context` and `next` are automatically typed
export const onRequest = defineMiddleware(async (context, next) => {
  try {
    const supabaseUrl = import.meta.env.SUPABASE_URL;
    const supabaseKey = import.meta.env.SUPABASE_KEY;
    const headers = new Headers();

    if (!import.meta.env.SUPABASE_URL || !import.meta.env.SUPABASE_KEY) {
      throw new Error("Missing Supabase Environment Variables");
    }

    const cookies: CookieMethodsServer = {
      getAll() {
        const cookieHeader = context.request.headers.get("Cookie");
        if (!cookieHeader) {
          return null;
        }
        return parseCookieHeader(cookieHeader).map(({ name, value }) => ({
          name,
          value: value ?? "",
        }));
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options: CookieOptions;
        }[],
      ) {
        cookiesToSet.forEach(({ name, value, options }) => {
          headers.append(
            "Set-Cookie",
            serializeCookieHeader(name, value, options),
          );
        });
      },
    };

    const supabase = createServerClient<Database, "public">(
      supabaseUrl,
      supabaseKey,
      {
        cookies: cookies,
      },
    ) as unknown as SupabaseClient<Database, "public">;

    context.locals.supabase = supabase;
    context.locals.headers = headers;
  } catch (e) {
    console.log(e);
  }
  return next();
});
