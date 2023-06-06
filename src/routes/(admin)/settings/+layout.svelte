<script>
  import TopBar from "../../TopBar.svelte";
  import home from '$lib/img/home-svgrepo-com.svg';
  import plus from '$lib/img/add-plus-circle-svgrepo-com.svg';
  import connector from '$lib/img/connector-svgrepo-com.svg';
  import sub from '$lib/img/device-remote-controller-svgrepo-com.svg';
  import conf from '$lib/img/settings-svgrepo-com.svg';
  import { signOut } from "@auth/sveltekit/client";
  import { page } from "$app/stores"
</script>
<div class='grow flex flex-col pb-1'>
  <TopBar title="Black Dash Settings" />
  <div class='grow flex'>
    <div class='basis-[14%] mt-5 pr-2 border-r border-slate-200 text-sm'>
      <div class='p-2 text-slate-700 hover:bg-slate-100 rounded-sm font-medium flex gap-2'>
        <img class='self-center' src={home} alt='Home icon' width=15 height=15 />
        <a href="/settings" class='hover:cursor-pointer inline-block w-full'>Home</a>
      </div>
      <div class='mt-2 p-2 text-slate-700 hover:bg-slate-100 rounded-sm font-medium flex gap-1'>
        <img class='self-center' src={plus} alt='Home icon' width=20 height=20 />
        <a href="/settings/admin" class='hover:cursor-pointer inline-block w-full'>Admin</a>
      </div>
      <div class='mt-2 p-2 text-slate-700 hover:bg-slate-100 rounded-sm font-medium flex gap-1'>
        <img class='self-center' src={connector} alt='Home icon' width=20 height=20 />
        <a href="/settings/mqtt-connector" class='hover:cursor-pointer inline-block w-full'>MQTT connector</a>
      </div>
      <div class='mt-2 p-2 text-slate-700 hover:bg-slate-100 rounded-sm font-medium flex gap-1'>
        <img class='self-center' src={sub} alt='Home icon' width=20 height=20 />
        <a href="/settings/mqtt-sub" class='hover:cursor-pointer inline-block w-full'>MQTT subscribers</a>
      </div>
      <div class='mt-2 p-2 text-slate-700 hover:bg-slate-100 rounded-sm font-medium flex gap-1'>
        <img class='self-center' src={conf} alt='Home icon' width=20 height=20 />
        <a href="#" class='hover:cursor-pointer inline-block w-full'>Login</a>
      </div>
    </div>
    <div class='grow p-4 pl-8'>
      <div class='mt-2 flex justify-between'>
        <div class="font-medium text-slate-400 text-sm self-center">{ $page.data.session?.user?.name ?? "" }</div>
        <a
          class="bg-slate-200/80 text-slate-700 font-semibold tracking-wide rounded-md py-2 px-4 text-sm"
          href={`/api/auth/signout`}
          on:click={(e) => {
            e.preventDefault();
            signOut({callbackUrl: '/login'});
          }}
        >
          {' '}
          Sign Out
        </a>
      </div>
      
      <div class='mt-12'>
        <slot />
      </div>
    </div>
  </div>
</div>