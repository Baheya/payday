// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EmailOtpType } from "@supabase/supabase-js";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createSbClient } from "#lib/supabase.ts";
import { defineAction } from "astro:actions";

export const auth = {
  signup: defineAction({
    handler: async (_, { request, cookies }) => {
      const formData = await request.formData();
      const email = formData.get("email")?.toString();
      const password = formData.get("password")?.toString();
      const name = formData.get("name")?.toString();
      const captchaToken = formData.get("h-captcha-response")?.toString();

      if (!email || !password || !name) {
        return new Response("Email, password, and name are required", {
          status: 400,
        });
      }

      const supabase = createSbClient({ request: request, cookies: cookies });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          ...(captchaToken && { captchaToken }),
        },
      });

      if (error) {
        console.error(error);
        throw new Error(error.message);
      }

      return new Response("Successfully signed in", { status: 200 });
    },
  }),
  signin: defineAction({
    handler: async (_, { request, cookies }) => {
      const formData = await request.formData();
      const email = formData.get("email")?.toString();
      const password = formData.get("password")?.toString();
      const captchaToken = formData.get("h-captcha-response")?.toString();

      if (!email || !password) {
        return new Response("Email and password are required", { status: 400 });
      }

      const supabase = createSbClient({ request: request, cookies: cookies });

      const { error } =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await supabase.auth.signInWithPassword({
          email,
          password,
          ...(captchaToken && {
            options: {
              captchaToken,
            },
          }),
        });

      if (error) {
        return new Response(error.message, { status: 500 });
      }
    },
  }),
  confirm: defineAction({
    handler: async (_, { request, cookies }) => {
      const requestUrl = new URL(request.url);
      const token_hash = requestUrl.searchParams.get("token_hash");
      const type = requestUrl.searchParams.get("type") as EmailOtpType | null;

      if (token_hash && type) {
        const supabase = createSbClient({ request: request, cookies: cookies });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { error } = await supabase.auth.verifyOtp({
          type,
          token_hash,
        });

        if (!error) {
          return new Response("Email confirmation success!", { status: 200 });
        }
      }
    },
  }),
  signout: defineAction({
    handler: async (_, { request, cookies }) => {
      const supabase = createSbClient({ request: request, cookies: cookies });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await supabase.auth.signOut();
      return new Response("Successfully logged out", { status: 200 });
    },
  }),
};
