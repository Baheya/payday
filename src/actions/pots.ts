import { createSbClient } from "#lib/supabase.ts";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";

export const pots = {
  getAllPots: defineAction({
    handler: async (__, { request, cookies }) => {
      try {
        const supabase = createSbClient({ request, cookies });

        const { data, error } = await supabase
          .from("pots")
          .select("*, colors ( * )");

        if (!error) {
          return data;
        }
      } catch (e) {
        console.error(e);
      }
    },
  }),
  addNewPot: defineAction({
    input: z.object({
      name: z.string(),
      theme_id: z.coerce.number(),
      target: z.coerce.number(),
      saved: z.coerce.number(),
    }),
    accept: "form",
    handler: async (input, { request, cookies }) => {
      try {
        const supabase = createSbClient({ request, cookies });

        const { data: userData, error: userError } =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          await supabase.auth.getUser();
        if (userError) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "User must be logged in.",
            stack: userError.stack,
          });
        }
        const inputWithUserId = { ...input, user_id: userData.user?.id };

        const { data, error } = await supabase
          .from("pots")
          .insert([inputWithUserId])
          .select("name");
        if (error) {
          return {
            success: false,
            message: `Something went wrong! Error: ${error.message}`,
          };
        }
        return {
          success: true,
          message: `A new Pot named ${data[0].name} has been created`,
        };
      } catch (error) {
        console.error(error);
      }
    },
  }),
  editPot: defineAction({
    input: z.object({
      name: z.string().optional(),
      theme_id: z.coerce.number().optional(),
      target: z.coerce.number().optional(),
      id: z.coerce.number(),
    }),
    accept: "form",
    handler: async (input, { request, cookies }) => {
      try {
        const supabase = createSbClient({ request, cookies });
        const { data: userData, error: userError } =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          await supabase.auth.getUser();
        if (userError) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "User must be logged in.",
            stack: userError.stack,
          });
        }
        const inputWithUserId = { ...input, user_id: userData.user?.id };

        const { data, error } = await supabase
          .from("pots")
          .update([inputWithUserId])
          .eq("id", inputWithUserId.id)
          .select("name");
        if (error) {
          return {
            success: false,
            message: `Something went wrong! Error: ${error.message}`,
          };
        }

        return {
          success: true,
          message: `The Pot for ${data[0].name} has been updated.`,
        };
      } catch (error) {
        console.error(error);
      }
    },
  }),
  deletePot: defineAction({
    input: z.object({
      id: z.coerce.number(),
    }),
    accept: "form",
    handler: async (input, { request, cookies }) => {
      try {
        const supabase = createSbClient({ request, cookies });
        const { data: userData, error: userError } =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          await supabase.auth.getUser();
        if (userError) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "User must be logged in.",
            stack: userError.stack,
          });
        }
        const inputWithUserId = { ...input, user_id: userData.user?.id };

        const { data, error } = await supabase
          .from("pots")
          .delete()
          .eq("id", inputWithUserId.id)
          .select("name");
        if (error) {
          return {
            success: false,
            message: `Something went wrong! Error: ${error.message}`,
          };
        }

        return {
          success: true,
          message: `The Pot for ${data[0].name} has been deleted.`,
        };
      } catch (error) {
        console.error(error);
      }
    },
  }),
  addToPot: defineAction({
    input: z.object({
      amount_to_add: z.coerce.number(),
      id: z.coerce.number(),
      current_savings: z.coerce.number(),
    }),
    accept: "form",
    handler: async (input, { request, cookies }) => {
      try {
        const supabase = createSbClient({ request, cookies });
        const { data: userData, error: userError } =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          await supabase.auth.getUser();
        if (userError) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "User must be logged in.",
            stack: userError.stack,
          });
        }
        const totalAmountSaved = input.amount_to_add + input.current_savings;
        const inputWithUserId = {
          saved: totalAmountSaved,
          id: input.id,
          user_id: userData.user?.id,
        };

        const { data, error } = await supabase
          .from("pots")
          .update([inputWithUserId])
          .eq("id", inputWithUserId.id)
          .select("name");
        if (error) {
          return {
            success: false,
            message: `Something went wrong! Error: ${error.message}`,
          };
        }

        return {
          success: true,
          message: `The saved amount in Pot ${data[0].name} has been updated.`,
        };
      } catch (error) {
        console.error(error);
      }
    },
  }),
  withdrawFromPot: defineAction({
    input: z.object({
      amount_to_withdraw: z.coerce.number(),
      id: z.coerce.number(),
      current_savings: z.coerce.number(),
    }),
    accept: "form",
    handler: async (input, { request, cookies }) => {
      try {
        const supabase = createSbClient({ request, cookies });
        const { data: userData, error: userError } =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          await supabase.auth.getUser();
        if (userError) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "User must be logged in.",
            stack: userError.stack,
          });
        }
        const newAmount = input.current_savings - input.amount_to_withdraw;
        const inputWithUserId = {
          saved: newAmount,
          id: input.id,
          user_id: userData.user?.id,
        };

        const { data, error } = await supabase
          .from("pots")
          .update([inputWithUserId])
          .eq("id", inputWithUserId.id)
          .select("name");
        if (error) {
          return {
            success: false,
            message: `Something went wrong! Error: ${error.message}`,
          };
        }

        return {
          success: true,
          message: `The saved amount in Pot ${data[0].name} has been updated.`,
        };
      } catch (error) {
        console.error(error);
      }
    },
  }),
};
