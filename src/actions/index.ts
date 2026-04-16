import { budgets } from "./budgets.ts";
import { categories } from "./categories.ts";
import { colors } from "./colors.ts";
import { overview } from "./overview.ts";
import { transactions } from "./transactions.ts";
import {
  type CookieMethodsServer,
  parseCookieHeader,
  type CookieOptions,
  serializeCookieHeader,
  createServerClient,
} from "@supabase/ssr";
import { type Database } from "#db/types.ts";
import { defineAction, type ActionAPIContext } from "astro:actions";

export const server = {
  budgets,
  categories,
  colors,
  transactions,
  overview,
  createClient: defineAction({
    handler: (context: ActionAPIContext) => {
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

      const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
        cookies: cookies,
      });
      return { supabase, headers };
    },
  }),
};
