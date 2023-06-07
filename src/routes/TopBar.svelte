<script>
  import logo from '$lib/img/Black Dash_adobe_express.svg';
  export let title;
</script>

<div class='flex justify-between mr-1'>
  <div class='text-2xl font-semibold'>
      <a href="/">{title}</a>
  </div>
  <img
    src={logo}
    width=120
    height=120
    alt='Black Dash'
  />
</div>