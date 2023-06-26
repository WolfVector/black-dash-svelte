<script>
  import CircleSpinner from '$lib/components/CircleSpinner.svelte';
  import RectAlert from '$lib/components/RectAlert.svelte';
  import { handleAsyncReq } from '$lib/js/makeRequest.svelte';
  import { onMount } from 'svelte';
  import { Toasts, toast } from 'svoast';
  import Modal from '$lib/components/Modal.svelte';
  import mqtt_client from 'u8-mqtt/esm/web/index.js'

  export let data
  let title = data.topics.title
  let topic = data.topics.topic
  let originalTopic = topic
  let oldTopic = topic
  let mqttData = {}

  let keyFields = data.topics.keyFields
  
  let spinner = false
  let messages = null
  let type = null

  let deleteModal = false
  let fieldToDelete = ''
  let keyToDelete = null

  let my_mqtt = null

  onMount(async () => {
    if(data.broker !== "no-mqtt") {
      my_mqtt = mqtt_client()
      .with_websock(`${data.broker.url}:${data.broker.port}`)
      // or .with_tcp('tcp://test.mosquitto.org:1883')
      .with_autoreconnect()

      await my_mqtt.connect()

      if(topic) {
        my_mqtt.subscribe_topic(
          topic,
          async (pkt, params, ctx) => {
            let temp = await pkt.json()
            
            Object.keys(temp).forEach(key => {
              if(!keyFields[key]) {
                keyFields[key] = { title: '', units: '' }
              }
              keyFields[key].value = temp[key]
            })

            mqttData = temp
          })
      }
    }
  })

  function handleSubscribe() {
    if(oldTopic) my_mqtt.unsubscribe(oldTopic)
    keyFields = data.topics.keyFields
    mqttData = {}

    my_mqtt.subscribe_topic(
      topic,
      async (pkt, params, ctx) => {
        let temp = await pkt.json()

        Object.keys(temp).forEach(key => {
          if(!keyFields[key]) {
            keyFields[key] = { title: '', units: '' }
          }
          keyFields[key].value = temp[key]
        })
        mqttData = temp
    })

    toast.success("Susbscribed", { duration: 3000 })

    oldTopic = topic
  }

  async function handleMqttSave() {
    spinner = true
    messages = null

    const res = await handleAsyncReq("/api/settings/mqtt/sub/edit", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: data.topics.id, 
        title,
        topic,
        oldTopic: originalTopic,
        keyFields,
      }),
    })

    if(res === false) toast.error("Something went wrong on the server", { duration: 3000 })
    else if(!res.ok) {
      type = "error"
      messages = res.messages
    }
    else {
      toast.success("Topic saved", { duration: 3000 })
      
      res.keyFields.forEach(row => {
        let key = row.keyField
        if(keyFields[key] && !keyFields[key].id) {
          keyFields[key].id = row.id
        }
      })

      console.log(keyFields)
    }

    spinner = false
  }

  function handleFieldDelete(idField, key) {
    deleteModal = true
    fieldToDelete = idField
    keyToDelete = key
  }

  function closeHandler() {
    deleteModal = false
    fieldToDelete = ''
    keyToDelete = null
  }
  
  async function confirmDelete() {
    deleteModal = false

    const id = toast.info("Wait, deleting field...", { infinite: true })

    const res = await handleAsyncReq("/api/settings/mqtt/sub/field/delete", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: data.topics.id,
        field: fieldToDelete
      }),
    })

    toast.removeById(id)

    if(res === false) toast.error("There was some problem on the server", { duration: 3000 });
    else if(!res.ok) toast.error(res.messages[0], { duration: 3000 });
    else {
      delete keyFields[keyToDelete]
      toast.success("Field deleted", { duration: 3000 })
    }

    fieldToDelete = ''
    keyToDelete = null
  }

  console.log(data.topics)

</script>

<Toasts position="top-right" />
<div class="mt-6">
  <div class='text-sm text-slate-400 font-medium'>
    title
  </div>
  <input bind:value={title} type='text' class='mt-1 w-2/5 block border border-slate-300 rounded-sm p-2 font-medium focus:outline-none' />

  <div class='mt-4 text-sm text-slate-400 font-medium'>
    topic
  </div>
  <div class="flex gap-4">
    <input bind:value={topic} type='text' class='mt-1 w-2/5 border border-slate-300 rounded-sm p-2 font-medium focus:outline-none' />
    <button on:click={handleSubscribe} class="self-center py-1 px-2 rounded-md bg-green-400 text-white">Subscribe</button>
  </div>

  <div class="mt-4">
    <table class="mt-8 w-full divide-y divide-gray-200">
      <thead class="text-sm">
        <tr class="bg-gray-50">
          <th class="text-left font-medium py-2 text-gray-500">Key field</th>
          <th class="font-medium py-2 text-gray-500">Title field</th>
          <th class="font-medium py-2 text-gray-500">Value</th>
          <th class="font-medium py-2 text-gray-500">Units</th>
          <th class="font-medium py-2 text-gray-500">Delete</th>
        </tr>
      </thead>
      <tbody class="text-sm divide-y divide-gray-200">
        {#each Object.entries(keyFields) as [key, value]}
          <tr class="odd:bg-white even:bg-gray-50">
            <td class="px-2 py-2 bg-slate-300">{ key }</td>
            <td class="py-2 align-middle text-center"><input bind:value={keyFields[key].title} type="text" class="border border-slate-300 rounded-sm p-2 font-medium focus:outline-none" /></td>
            <td class="py-2 px-1 align-middle text-center bg-slate-300">{ keyFields[key].value || '' }</td>
            <td class="py-2 align-middle text-center"><input bind:value={keyFields[key].units} type="text" class="border border-slate-300 rounded-sm p-2 font-medium focus:outline-none" /></td>
            {#if keyFields[key].id }
              <td class="py-3 align-middle text-center"> <button on:click={() => handleFieldDelete(keyFields[key].id, key)} class="px-2 py-1 rounded-md bg-red-400 text-white">Delete</button> </td>
            {/if}
          </tr>
        {/each}
      </tbody>
    </table>
    <div class="mt-4 flex justify-end">
      <span class='self-center'>
        {#if spinner}
          <CircleSpinner width="w-6" height="h-6" baseColor="text-gray-500" />
        {/if}
      </span>
      <button on:click={handleMqttSave} class="p-2 rounded-md bg-blue-400 text-white"> Save </button>
    </div>      
  </div>
  {#if messages }
    <RectAlert {messages} {type} />
  {/if}
</div>
<Modal yesHandler={confirmDelete} closeHandler={closeHandler} isOpen={deleteModal}  />
