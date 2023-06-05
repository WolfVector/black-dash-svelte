<script>
  import { signIn, signOut } from "@auth/sveltekit/client"

  function handleOnAzure() {
    signIn("azure-ad", { callbackUrl: '/login' })   
  }
</script>

<button on:click={handleOnAzure} class='border rounded-md p-3 w-full flex justify-center gap-x-1'>
  <slot />
</button>