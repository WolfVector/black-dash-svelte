<script>
  import RectAlert from '$lib/components/RectAlert.svelte';
  import { page } from "$app/stores"
  import { Toasts, toast } from 'svoast';
  import CircleSpinner from '$lib/components/CircleSpinner.svelte';
    import { handleAsyncReq } from '$lib/js/makeRequest.svelte';

  export let data
  let myusername = $page.data.session.user.email
  let messages = null
  let type = null
  let spinner = false
  let spinnerPass = false
  let spinnerAzure = false 

  let username = data.user.username
  let oldUsername = username
  let cred = data.user.cred
  let password = ''
  let confirmPassword = ''

  let email = username

  async function handleEditCredUser() {
    spinner = true
    messages = null

    const res = await handleAsyncReq('/api/settings/admin/edit-cred/username', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        oldUsername
      })
    })

    if(!res) toast.error("Something went wrong on the server", { duration: 3000 })
    else if(!res.ok) {
      type = "error"
      messages = res.messages
    }
    else {
      if(myusername == oldUsername) {
        messages = ["Your username has been updated. If yout want to change your username or password you will have to sign out and sign in."]
        type = "success"
      }
      else toast.success("Admin updated", { duration: 3000 })
    }

    spinner = false
  }

  async function handleEditCredPass() {
    spinnerPass = true
    messages = null

    const res = await handleAsyncReq('/api/settings/admin/edit-cred/password', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: oldUsername,
        password,
        confirmPassword
      })
    })

    if(!res) toast.error("Something went wrong on the server", { duration: 3000 })
    else if(!res.ok) {
      messages = res.messages
      type = "error"
    }
    else toast.success("Admin updated", { duration: 3000 })

    spinnerPass = false
  }

  async function handleEditAzure() {
    spinnerAzure = true
    messages = null

    const res = await handleAsyncReq('/api/settings/admin/edit-azure', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        oldUsername
      })
    })

    if(!res) toast.error("Something went wrong on the server", { duration: 3000 })
    else if(!res.ok) {
      messages = res.messages
      type = "error"
    }
    else toast.success("Admin updated", { duration: 3000 })

    spinnerAzure = false
  }

</script>

<div>
  <Toasts position="top-right" />
  {#if data.messages }
    <RectAlert messages={data.messages} type="error" />
  {:else}
    {#if cred}
      <div class="mt-8">
        <div class='text-sm text-slate-400 font-medium'>
          username
        </div>
        <input bind:value={ username }   type='text' class='mt-1 w-2/5 block border border-slate-300 rounded-sm p-2 font-medium focus:outline-none' />

        <div class='flex gap-2 mt-6'>
          <button on:click={handleEditCredUser} class="w-1/6 rounded-md p-2 bg-blue-500/90 text-white hover:bg-blue-500">Update username</button>
          <span class='self-center'>
            {#if spinner }
              <CircleSpinner width="w-6" height="h-6" baseColor="text-gray-500" />
            {/if}
          </span>
        </div>

        <div class='mt-8 text-sm text-slate-400 font-medium'>
          New password
        </div>
        <input bind:value={password} type='password' class='mt-1 w-2/5 block border border-slate-300 rounded-sm p-2 font-medium focus:outline-none' />

        <div class='mt-4 text-sm text-slate-400 font-medium'>
          Confirm new password
        </div>
        <input bind:value={confirmPassword} type='password' class='mt-1 w-2/5 block border border-slate-300 rounded-sm p-2 font-medium focus:outline-none' />

        <div class='flex gap-2 mt-8'>
          <button on:click={handleEditCredPass} class="w-1/6 rounded-md p-2 bg-blue-500/90 text-white hover:bg-blue-500">Update password</button>
          <span class='self-center'>
            {#if spinnerPass }
              <CircleSpinner width="w-6" height="h-6" baseColor="text-gray-500" />
            {/if}
          </span>
        </div>
      </div>
    {:else}
      <div class="mt-8">
        <div class='text-sm text-slate-400 font-medium'>
          Microsoft email
        </div>
        <input bind:value={ email } type='text' class='mt-1 w-2/5 block border border-slate-300 rounded-sm p-2 font-medium focus:outline-none {(myusername == email) ? "bg-slate-200" : ""}' disabled={(myusername == email ? true : false)} />

        {#if myusername != email}
          <div class='flex gap-2 mt-8'>
            <button on:click={handleEditAzure} class="w-1/6 rounded-md p-2 bg-blue-500/90 text-white hover:bg-blue-500">Update</button>
            <span class='self-center'>
              {#if spinnerAzure }
                <CircleSpinner width="w-6" height="h-6" baseColor="text-gray-500" />
              {/if}
            </span>
          </div>
        {/if}
      </div>
    {/if}

    {#if messages }
      <RectAlert {messages} {type} />
    {/if}

  {/if}
</div>