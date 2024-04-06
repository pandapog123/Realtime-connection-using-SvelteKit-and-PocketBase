// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import PocketBase from "pocketbase";

declare global {
  namespace App {
    interface Locals {
      pocketBase: PocketBase;
      pocketBaseAdmin: PocketBase;
    }
    // interface Error {}
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
