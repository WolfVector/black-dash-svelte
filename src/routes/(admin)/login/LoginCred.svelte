<script>
    import { signIn } from "@auth/sveltekit/client";
    import CircleSpinner from "$lib/components/CircleSpinner.svelte";
    import { toast, Toasts } from 'svoast';

  let username = ''
  let password = ''
  let spinner = false

  async function handleOnCred() {
    spinner = true
    const admin = await signIn("credentials", { redirect: false, email: username, password })
    spinner = false

    if(!admin.error || admin.error === '') {
      window.location.href = '/settings'
      return
    }

    toast.error('Wrong username or password', {
      duration: 3000
    });
  }
</script>

<Toasts position="top-right" />
<div class='mt-8'>
  <div>
    <input bind:value={username} type='text' class='rounded-md bg-slate-100 p-3 w-full placeholder:text-slate-400 focus:outline-0' placeholder='Email' />
  </div>
  <div class='mt-3'>
    <input bind:value={password} type='password' class='rounded-md bg-slate-100 p-3 w-full placeholder:text-slate-400 focus:outline-0' placeholder='Password' />
  </div>
</div>
<div class='mt-6'>
  <button on:click={handleOnCred} class='flex justify-center w-full rounded-md p-3 bg-blue-500/90 text-white hover:bg-blue-500'>
    <span class='mr-2 self-center'>Login</span> 
    <span class='self-center'>
      {#if spinner}
        <CircleSpinner width="w-4" height="h-4" />
      {/if}
    </span>
  </button>
</div>