<script>
  import Modal from '$lib/components/Modal.svelte';
  import { handleAsyncReq } from '$lib/js/makeRequest.svelte';
  import { Toasts, toast } from 'svoast';

  export let data
  let deleteModal = false
  let userToDelete = ''

  async function handleAdminDelete(username) {
    deleteModal = true
    userToDelete = username
  }

  function closeHandler() {
    deleteModal = false
    userToDelete = ''
  }

  async function confirmDelete() {
    deleteModal = false

    const id = toast.info("Wait, deleting admin...", { infinite: true })

    const res = await handleAsyncReq("/api/settings/admin/delete", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userToDelete
      }),
    })

    toast.removeById(id)

    if(res === false) toast.error("There was some problem on the server", { duration: 3000 });
    else if(!res.ok) toast.error("There was a problem while deleting the admin", { duration: 3000 });
    else {
      data.users = data.users.filter(user => user.username !== userToDelete)
      toast.success("Admin deleted", { duration: 3000 })
    }

    userToDelete = ''
  }

</script>

<Toasts position="top-right" />
<div class="flex justify-end">
  <a href="/settings/admin/new" class="p-2 rounded-md bg-blue-400 text-white">New admin</a>
</div>
<table class="mt-8 w-full divide-y divide-gray-200">
  <thead class="text-sm">
    <tr class="bg-gray-50">
      <th class="text-left font-medium py-2 text-gray-500">Username</th>
      <th class="font-medium py-2 text-gray-500">Edit</th>
      <th class="font-medium py-2 text-gray-500">Delete</th>
    </tr>
  </thead>
  <tbody class="text-sm divide-y divide-gray-200">
    {#each data.users as user}
      <tr class="odd:bg-white even:bg-gray-50">
        <td class="px-2 py-3">{ user.username }</td>
        <td class="py-3 align-middle text-center"> <a href="/settings/admin/edit/{user.username}"  class="px-2 py-1 rounded-md bg-amber-400/60 text-white">Edit</a> </td>
        <td class="py-3 align-middle text-center"> <button on:click={() => handleAdminDelete(user.username)}  class="px-2 py-1 rounded-md bg-red-400 text-white">Delete</button> </td>
      </tr>
    {/each}
  </tbody>
</table>

<Modal yesHandler={confirmDelete} closeHandler={closeHandler} isOpen={deleteModal}  />
