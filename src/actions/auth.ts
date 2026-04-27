import { defineAction } from "astro:actions";

export const auth = {
  signin: defineAction({
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
};
