import { defineAction } from "astro:actions";

export const auth = {
  signup: defineAction({
    handler: async (_, context) => {
      const formData = await context.request.formData();
      const email = formData.get("email")?.toString();
      const password = formData.get("password")?.toString();
      const name = formData.get("name")?.toString();

      if (!email || !password || !name) {
        return new Response("Email, password, and name are required", {
          status: 400,
        });
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { error } = await context.locals.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        return new Response(error.message, { status: 500 });
      }

      return new Response("Successfully signed in", { status: 200 });
    },
  }),
  signin: defineAction({
    handler: async (_, context) => {
      const formData = await context.request.formData();
      const email = formData.get("email")?.toString();
      const password = formData.get("password")?.toString();

      if (!email || !password) {
        return new Response("Email and password are required", { status: 400 });
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { data, error } =
        await context.locals.supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        return new Response(error.message, { status: 500 });
      }

      const { access_token, refresh_token } = data.session;
      context.cookies.set("sb-access-token", access_token, {
        path: "/",
      });
      context.cookies.set("sb-refresh-token", refresh_token, {
        path: "/",
      });
    },
  }),
};
