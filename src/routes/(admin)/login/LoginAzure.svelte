<script>
  import CircleSpinner from "$lib/components/CircleSpinner.svelte";
  import { signIn, signOut } from "@auth/sveltekit/client"

  let spinner = false

  function handleOnAzure() {
    spinner = true
    signIn("azure-ad", { callbackUrl: '/login' })   
  }
</script>

<button on:click={handleOnAzure} class='border rounded-md p-3 w-full flex justify-center gap-x-1'>
  <slot />
  {#if spinner}
    <span class="self-center">
      <CircleSpinner width="w-6" height="h-6" baseColor="text-gray-500" />
    </span>
  {/if}
</button>