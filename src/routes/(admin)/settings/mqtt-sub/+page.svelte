<script>
  import Modal from '$lib/components/Modal.svelte';
  import { handleAsyncReq } from '$lib/js/makeRequest.svelte';
  import { Toasts, toast } from 'svoast';

  export let data
  let deleteModal = false
  let topicToDelete = ''

  console.log(data.topics)

  async function handleTopicDelete(topic) {
    deleteModal = true
    topicToDelete = topic
  }

  function closeHandler() {
    deleteModal = false
    topicToDelete = ''
  }

  async function confirmDelete() {
    deleteModal = false

    const id = toast.info("Wait, deleting admin...", { infinite: true })

    const res = await handleAsyncReq("/api/settings/mqtt/sub/delete", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: topicToDelete
      }),
    })

    toast.removeById(id)

    if(res === false) toast.error("There was some problem on the server", { duration: 3000 });
    else if(!res.ok) toast.error(res.messages[0], { duration: 3000 });
    else {
      data.topics = data.topics.filter(topic => topic.topic !== topicToDelete)
      toast.success("Topic deleted", { duration: 3000 })
    }

    topicToDelete = ''
  }

</script>

<Toasts position="top-right" />
<div class="flex justify-end">
  <a href="/settings/mqtt-sub/new" class="p-2 rounded-md bg-blue-400 text-white">New subscriber</a>
</div>
<table class="mt-8 w-full divide-y divide-gray-200">
  <thead class="text-sm">
    <tr class="bg-gray-50">
      <th class="text-left font-medium py-2 text-gray-500">Subscriber</th>
      <th class="font-medium py-2 text-gray-500">Edit</th>
      <th class="font-medium py-2 text-gray-500">Delete</th>
    </tr>
  </thead>
  <tbody class="text-sm divide-y divide-gray-200">
    {#each data.topics as topic}
      <tr class="odd:bg-white even:bg-gray-50">
        <td class="px-2 py-3">{ topic.topic }</td>
        <td class="py-3 align-middle text-center"> <a href="/settings/mqtt-sub/edit/{topic.id}"  class="px-2 py-1 rounded-md bg-amber-400/60 text-white">Edit</a> </td>
        <td class="py-3 align-middle text-center"> <button on:click={() => handleTopicDelete(topic.topic)} class="px-2 py-1 rounded-md bg-red-400 text-white">Delete</button> </td>
      </tr>
    {/each}
  </tbody>
</table>

<Modal yesHandler={confirmDelete} closeHandler={closeHandler} isOpen={deleteModal}  />
