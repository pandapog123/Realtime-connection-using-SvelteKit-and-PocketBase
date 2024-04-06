import {
  POCKETBASE_PRIVATE_EMAIL,
  POCKETBASE_PRIVATE_PASSWORD,
} from "$env/static/private";
import { fail } from "@sveltejs/kit";
import PocketBase from "pocketbase";

export const handle = async ({ event, resolve }) => {
  event.locals.pocketBase = new PocketBase("http://127.0.0.1:8090");

  try {
    event.locals.pocketBase.authStore.loadFromCookie(
      event.request.headers.get("cookie") ?? ""
    );

    if (event.locals.pocketBase.authStore.isValid) {
      await event.locals.pocketBase.collection("users").authRefresh();
    }
  } catch (error) {
    event.locals.pocketBase.authStore.clear();
  }

  event.locals.pocketBaseAdmin = new PocketBase("http://127.0.0.1:8090");

  try {
    await event.locals.pocketBaseAdmin.admins.authWithPassword(
      POCKETBASE_PRIVATE_EMAIL,
      POCKETBASE_PRIVATE_PASSWORD
    );
  } catch (error) {
    throw fail(500);
  }

  const response = await resolve(event);

  response.headers.append(
    "set-cookie",
    event.locals.pocketBase.authStore.exportToCookie({
      sameSite: "Lax",
      httpOnly: false,
      path: "/",
      secure: false,
    })
  );

  return response;
};
