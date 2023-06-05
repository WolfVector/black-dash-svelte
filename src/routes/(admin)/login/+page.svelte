<script>
  import TopBar from "../../TopBar.svelte";
  import LoginCred from "./LoginCred.svelte";
  import LoginAzure from "./LoginAzure.svelte";
  import azure from '$lib/img/azure.svg';

  import { page } from "$app/stores"
</script>

<div class='flex flex-col'>
  <TopBar title="Black Dash" />
  {#if $page.data.session}
    <strong>{$page.data.session.user?.name ?? "User"}</strong>
  {/if}
  <div class='flex justify-center'>
    <div class='basis-1/4 mt-24'>
      <div class='font-semibold text-gray-800 text-2xl'>Welcome back!</div>
      <LoginCred />

      <div class='mt-9'>
        <div class="header__center">
          or
        </div>
        <div class='mt-5'>
          <LoginAzure>
            <img
              src={azure}
              width=30
              height=30
              alt='Azure Icon'
            />
            <span class='self-center font-medium'>Microsoft</span>
          </LoginAzure>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .header__center {
    display: grid;
    grid-template-columns: 1fr max-content 1fr;
    grid-column-gap: 0.7rem;
    align-items: center;
    color: rgb(185, 188, 192);
  }

  .header__center::before,
  .header__center::after {
    content: "";
    display: block;
    height: 1px;
    background-color: rgb(209 213 219 / 0.5);
  }
</style>