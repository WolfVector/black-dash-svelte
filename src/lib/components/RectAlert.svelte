<script>
  export let messages = []
  export let type

  let color = "bg-green-300"
  if(type == "error")
    color = "bg-red-400 text-slate-100"

</script>

<div class='p-4 {color} rounded-md mt-4 text-sm font-medium'>
  {#each messages as message }
      <li>{ message }</li>
  {/each}
</div>