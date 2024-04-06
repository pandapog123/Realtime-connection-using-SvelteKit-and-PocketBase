import { redirect } from "@sveltejs/kit";
import z from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const actions = {
  default: async ({ locals, request }) => {
    if (locals.pocketBase.authStore.isValid) {
      throw redirect(303, "/");
    }

    let formData = Object.fromEntries(await request.formData());

    try {
      let validatedFormData = loginSchema.parse(formData);

      await locals.pocketBase
        .collection("users")
        .authWithPassword(validatedFormData.email, validatedFormData.password);
    } catch (error) {
      if (error instanceof Error) {
        return {
          message: error.message,
        };
      }

      return {
        message: "Unknown error occured while trying to log in",
      };
    }

    throw redirect(303, "/");
  },
};
