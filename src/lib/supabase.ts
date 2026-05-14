import type { Database } from "#db/types.ts";
import type { AstroCookies, AstroCookieSetOptions } from "astro";

import {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  createServerClient,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  parseCookieHeader,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  type CookieOptions,
} from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {});

export function createSbClient({
  request,
  cookies,
}: {
  request: Request;
  cookies: AstroCookies;
}) {
  return createServerClient<Database, "public">(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        const cookieHeader = request.headers.get("Cookie");
        if (!cookieHeader) {
          return null;
        }
        return parseCookieHeader(cookieHeader).map(
          ({ name, value }: { name: string; value?: string | undefined }) => ({
            name,
            value: value ?? "",
          }),
        );
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options: CookieOptions;
        }[],
      ) {
        cookiesToSet.forEach(
          ({
            name,
            value,
            options,
          }: {
            name: string;
            value: string;
            options: AstroCookieSetOptions;
          }) => cookies.set(name, value, options),
        );
      },
    },
  }) as unknown as typeof supabase;
}
