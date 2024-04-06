<script lang="ts">
  import type { ActionData } from "./$types";

  export let form: ActionData;
</script>

<h1>Log in</h1>

<form method="post">
  <input type="email" name="email" placeholder="Enter your e-mail" />
  <input type="password" name="password" placeholder="Enter your password" />

  <button>Finally Log in</button>
</form>

{#if form?.message}
  <p class="error">{form.message}</p>
{/if}

<div>
  <span>Don't have an account?</span>
  <a href="/auth/create-account">Create an Account!</a>
</div>

<style>
  .error {
    color: red;
  }
</style>
