<script>
    import CircleSpinner from "$lib/components/CircleSpinner.svelte";
    import RectAlert from "$lib/components/RectAlert.svelte";
    import { handleAsyncReq } from "$lib/js/makeRequest.svelte";
    import { Toasts, toast } from "svoast";

  let adminRadio = "credentials"
  let spinner = false
  let spinnerAzure = false
  let messages = null
  let type = null

  let username = ''
  let password = ''
  let confirmPassword = ''

  let email = ''

  function handleAdminRadio(evt) {
    adminRadio = evt.target.value
  }

  async function handleAdminAdd(url, body){
    messages = null

    const res = await handleAsyncReq(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if(res === false) toast.error("Something went wrong on the server", { duration: 3000 })
    else if(!res.ok) {
      type = "error"
      messages = res.messages
    }
    else  {
      toast.success("Admin added successfully", { duration: 3000 })
    }

    
  }

  async function handleOnCred() {
    spinner = true
    await handleAdminAdd("/api/settings/admin/add-cred", {
      username,
      password, 
      confirmPassword
    })
    spinner = false
  }

  async function handleOnAzure() {
    spinnerAzure = true
    await handleAdminAdd("/api/settings/admin/add-azure", {
      username: email,
    })
    spinnerAzure = false
  }

</script>

<Toasts position="top-right" />
<div class='text-xl font-medium'>Add admin</div>
<div class="mt-8">
  <div class='text-sm text-slate-600 font-medium'>
    <input 
      type="radio" 
      name="adminType" 
      value="credentials" 
      checked={adminRadio === "credentials"} 
      on:change={handleAdminRadio} 
    />
    <span class="ml-2">Add with credentials</span><br />

    <input 
      type="radio" 
      name="adminType" 
      value="azure" 
      checked={adminRadio === "azure"} 
      on:change={handleAdminRadio} 
    />
    <span class="ml-2">Add with Azure Active Directory</span>
  </div>

  <div class="mt-8">
    {#if adminRadio == "credentials"}
      <div class='text-sm text-slate-400 font-medium'>
        username
      </div>
      <input bind:value={username} type='text' class='mt-1 w-2/5 block border border-slate-300 rounded-sm p-2 font-medium focus:outline-none' />

      <div class='mt-4 text-sm text-slate-400 font-medium'>
        password
      </div>
      <input bind:value={password} type='password' class='mt-1 w-2/5 block border border-slate-300 rounded-sm p-2 font-medium focus:outline-none' />

      <div class='mt-4 text-sm text-slate-400 font-medium'>
        New password
      </div>
      <input bind:value={confirmPassword} type='password' class='mt-1 w-2/5 block border border-slate-300 rounded-sm p-2 font-medium focus:outline-none' />

      <div class='flex gap-2 mt-8'>
        <button on:click={handleOnCred} class="w-1/6 rounded-md p-2 bg-blue-500/90 text-white hover:bg-blue-500">Add</button>
        <span class='self-center'>
          {#if spinner}
            <CircleSpinner width="w-6" height="h-6" baseColor="text-gray-500" />
          {/if}
        </span>
      </div>
    {:else}
      <div class='text-sm text-slate-400 font-medium'>
        Microsoft email
      </div>
      <input bind:value={email} type='text' class='mt-1 w-2/5 block border border-slate-300 rounded-sm p-2 font-medium focus:outline-none' />

      <div class='flex gap-2 mt-8'>
        <button on:click={handleOnAzure} class="w-1/6 rounded-md p-2 bg-blue-500/90 text-white hover:bg-blue-500">Add</button>
        <span class='self-center'>
          {#if spinnerAzure}
            <CircleSpinner width="w-6" height="h-6" baseColor="text-gray-500" />
          {/if}
        </span>
      </div>
    {/if}

    {#if messages }
      <RectAlert {messages} {type} />
    {/if}

  </div>

</div>