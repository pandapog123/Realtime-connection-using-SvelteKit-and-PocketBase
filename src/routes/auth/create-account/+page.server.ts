import { redirect } from "@sveltejs/kit";
import z from "zod";

const createAccountSchema = z.object({
  name: z.string().min(1),
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
      let validatedFormData = createAccountSchema.parse(formData);

      const userWithNameExists = await locals.pocketBase
        .collection("users")
        .getFirstListItem(`name="${validatedFormData}"`)
        .catch(() => undefined);

      if (userWithNameExists) {
        throw new Error("Name is already taken");
      }

      await locals.pocketBaseAdmin.collection("users").create({
        ...validatedFormData,
        passwordConfirm: validatedFormData.password,
        emailVisibility: false,
      });

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
        message: "Unknown error occured while trying to create an account",
      };
    }

    throw redirect(303, "/");
  },
};
