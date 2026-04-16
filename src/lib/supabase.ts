import type { Database } from "#db/types.ts";
import type { APIContext } from "astro";

import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
  type CookieMethodsServer,
  type CookieOptions,
} from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;

export const createServerClientInstance = (context: APIContext) => {
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
  return createServerClient<Database, "public">(supabaseUrl, supabaseKey, {
    cookies: cookies,
  });
};

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
