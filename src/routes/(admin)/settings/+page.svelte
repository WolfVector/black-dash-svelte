<script>

  import CircleSpinner from "$lib/components/CircleSpinner.svelte";
  import { page } from "$app/stores"
  import { handleAsyncReq } from "$lib/js/makeRequest.svelte";
  import { Toasts, toast } from "svoast";
  import RectAlert from "$lib/components/RectAlert.svelte";
  
  let username = $page.data.session.user.email
  let spinner = false
  let spinnerPass = false
  let messages = null
  let type = null

  async function handleUserUpdate() {
    spinner = true
    messages = null

    const res = await handleAsyncReq('/api/settings/admin/username', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
      })
    })

    if(!res) toast.error('Something went wrong on the server', {duration: 3000});
    else if(!res.ok) {
      type = "error"
      messages = res.messages
    }
    else {
      messages = ["Your username has been updated. The username will change until you sign out and sign in again, for the moment, you will not be able to change your username or password until the next session"]
      type = "success"
      //toast.success('Admin was updated', {duration: 3000 });
    }

    spinner = false
  }

  let newPassword = ''
  let confirmNewPassword = ''

  async function handleAdminPassUpdate() {
    spinner = true
    messages = null

    const res = await handleAsyncReq('/api/settings/admin/password', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newPassword,
        confirmNewPassword
      })
    })

    if(!res) toast.error("Something went wrong on the server", { duration: 3000 })
    else if(!res.ok) {
      type = "error"
      messages = res.messages
    }
    else {
      toast.success("Admin password updated", { duration: 3000 })
    }

    spinner = false
  }

</script>

<Toasts position="top-right" />
<div class='text-xl font-medium'>Profile</div>
<div class='mt-6'>
  <div class='text-sm text-slate-400 font-medium'>
    username
  </div>
  <input bind:value={username} type='text' class='mt-1 w-2/5 block border border-slate-300 rounded-sm p-2 font-medium focus:outline-none {$page.data.session.user.black_dash_credentials ? "" : "bg-slate-200"}' disabled={$page.data.session.user.black_dash_credentials ? false : true} />
  
  <div class='flex gap-2 mt-6'>
    {#if $page.data.session?.user?.black_dash_credentials }
      <button on:click={handleUserUpdate} class="w-1/6 rounded-md p-2 bg-blue-500/90 text-white hover:bg-blue-500">Update username</button>
    {/if}
    <span class='self-center'>
      {#if spinner}
        <CircleSpinner width="w-4" height="h-4" />
      {/if}
    </span>
  </div>

  {#if $page.data.session?.user?.black_dash_credentials }
    <div class='mt-4 text-sm text-slate-400 font-medium'>
      New password
    </div>
    <input bind:value={newPassword} type='password' class='mt-1 w-2/5 block border border-slate-300 rounded-sm p-2 font-medium focus:outline-none' />

    <div class='mt-4 text-sm text-slate-400 font-medium'>
      Confirm new password
    </div>
    <input bind:value={confirmNewPassword} type='password' class='mt-1 w-2/5 block border border-slate-300 rounded-sm p-2 font-medium focus:outline-none' />

    <div class='flex gap-2 mt-8'>
      <button on:click={handleAdminPassUpdate} class="w-1/6 rounded-md p-2 bg-blue-500/90 text-white hover:bg-blue-500">Update password</button>
      <span class='self-center'>
        {#if spinnerPass}
          <CircleSpinner width="w-4" height="h-4" />
        {/if}
      </span>
    </div>
  {/if}

  {#if messages }
    <RectAlert {messages} {type} />
  {/if}
</div>