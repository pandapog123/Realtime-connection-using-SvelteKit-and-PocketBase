<script lang="ts">
  import type { ActionData } from "./$types";

  export let form: ActionData;
</script>

<h1>Create Account</h1>

<form method="post">
  <input type="text" name="name" placeholder="Enter your name" />
  <input type="email" name="email" placeholder="Enter your e-mail" />
  <input type="password" name="password" placeholder="Enter your password" />

  <button>Finally Create Account</button>
</form>

{#if form?.message}
  <p class="error">{form.message}</p>
{/if}

<div>
  <span>Already have an account?</span>
  <a href="/auth/login">Log in!</a>
</div>

<style>
  .error {
    color: red;
  }
</style>
