<script>
  import CircleSpinner from "$lib/components/CircleSpinner.svelte";
  import RectAlert from "$lib/components/RectAlert.svelte";
  import { handleAsyncReq } from "$lib/js/makeRequest.svelte";
  import { Toasts, toast } from "svoast";

  export let data

  let spinner = false
  let messages = null
  let type = null

  let url = data.broker.url
  let port = data.broker.port
  let portType = data.broker.portType

  async function handleOnConnector() {
    spinner = true
    messages = null

    const res = await handleAsyncReq("/api/settings/mqtt/broker", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        port,
        portType
      }),
    })

    if(res === false) toast.error("Something went wrong on the server", { duration: 3000 })
    else if(!res.ok) {
      type = "error"
      messages = res.messages
    }
    else toast.success("MQTT Broker updated", { duration: 3000 })

    spinner = false
  }

</script>

<Toasts position="top-right" />
<div class='text-xl font-medium'>MQTT Broker</div>
<div class='mt-6'>
  <div class='text-sm text-slate-400 font-medium'>
    url
  </div>
  <input bind:value={url} type='text' class='mt-1 w-2/5 block border border-slate-300 rounded-sm p-2 font-medium focus:outline-none' />

  <div class='mt-4 text-sm text-slate-400 font-medium'>
    port
  </div>
  <input bind:value={port} type='text' class='mt-1 w-2/5 block border border-slate-300 rounded-sm p-2 font-medium focus:outline-none' />

  <div class='mt-4 text-sm text-slate-400 font-medium'>
    port type
  </div>
  <div class='mt-2 text-sm text-slate-600 font-medium'>
    <input 
      type="radio" 
      name="portType" 
      value="websocket" 
      bind:group={portType}
    />
    <span class="ml-2">WebSocket</span><br />

    <input 
      type="radio" 
      name="portType" 
      value="tcp" 
      bind:group={portType}
    />
    <span class="ml-2">TCP</span>
  </div>

  <div class='flex gap-2 mt-8'>
    <button on:click={handleOnConnector} class="w-1/6 rounded-md p-2 bg-blue-500/90 text-white hover:bg-blue-500">Add</button>
    <span class='self-center'>
      {#if spinner}
        <CircleSpinner width="w-6" height="h-6" baseColor="text-gray-500" />
      {/if}
    </span>
  </div>

  {#if messages }
    <RectAlert {messages} {type} />
  {/if}
</div>