import { fail, redirect } from "@sveltejs/kit";
import { EmojiDocument } from "./types.js";

export const load = async ({ locals }) => {
  if (!locals.pocketBase.authStore.isValid) {
    throw redirect(303, "/auth/create-account");
  }

  const emojis = await locals.pocketBase
    .collection("emojis")
    .getFullList<EmojiDocument>();

  return {
    emojis,
  };
};

export const actions = {
  default: async ({ locals, request }) => {
    if (!locals.pocketBase.authStore.isValid) {
      throw redirect(303, "/auth/create-account");
    }

    const formData = await request.formData();

    const emojiId = formData.get("emoji-id");

    if (typeof emojiId !== "string") {
      return fail(400);
    }

    const emoji = await locals.pocketBaseAdmin
      .collection("emojis")
      .getOne<EmojiDocument>(emojiId);

    if (emoji.votes.includes(locals.pocketBase.authStore.model!.id)) {
      await locals.pocketBaseAdmin.collection("emojis").update(emojiId, {
        "votes-": locals.pocketBase.authStore.model!.id,
      });
    } else {
      await locals.pocketBaseAdmin.collection("emojis").update(emojiId, {
        "votes+": locals.pocketBase.authStore.model!.id,
      });
    }
  },
};
