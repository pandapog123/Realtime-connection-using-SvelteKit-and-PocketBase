<script lang="ts">
  import { enhance } from "$app/forms";
  import { pb } from "$lib/pocketbase";
  import type { PageData } from "./$types";
  import type { EmojiDocument } from "./types";

  export let data: PageData;

  let emojis: EmojiDocument[] = data.emojis;

  $: if ($pb) {
    $pb.collection("emojis").subscribe<EmojiDocument>("*", (emojiUpdate) => {
      let emojiIndex = emojis.findIndex((emoji) => {
        return emoji.id === emojiUpdate.record.id;
      });

      emojis[emojiIndex] = emojiUpdate.record;
    });
  }
</script>

<h1>Vote for EMOJIS</h1>

<div class="emoji-grid">
  {#each emojis as emoji}
    <form method="post" use:enhance>
      <input type="hidden" name="emoji-id" value={emoji.id} />

      <h1>
        {emoji.emoji}
      </h1>

      <p>{emoji.votes.length} votes</p>

      <button>
        {emoji.votes.includes($pb?.authStore.model?.id ?? "")
          ? "Remove vote"
          : "Vote for emoji"}
      </button>
    </form>
  {/each}
</div>

<style>
  .emoji-grid {
    width: 100vw;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding: 1rem;
  }

  .emoji-grid form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-self: center;
    width: 100px;
    gap: 4px;
    background-color: rgb(236, 236, 236);
    border: 1px solid rgb(135, 135, 135);
    border-radius: 1rem;
    padding: 8px;
  }

  .emoji-grid form * {
    margin: 0;
  }
</style>
