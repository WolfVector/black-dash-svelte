<script>
  import { onMount } from "svelte";
  import TopBar from "./TopBar.svelte";
  import mqtt_client from 'u8-mqtt'

  export let data

  let my_mqtt = null

  onMount(async () => {
    if(data.broker !== "no-mqtt") {
      my_mqtt = mqtt_client()
      .with_websock(`${data.broker.url}:${data.broker.port}`)
      // or .with_tcp('tcp://test.mosquitto.org:1883')
      .with_autoreconnect()

      await my_mqtt.connect()

      my_mqtt.subscribe_topic(
      'u8-mqtt/*',
      (pkt, params, ctx) => {
        console.log('topic packet', params, pkt, pkt.json())
      })
    }
  })


</script>

<div class='flex flex-col'>
  <TopBar title="Black Dash" />
  <div class='grow mt-24'>
    <div class='grid grid-cols-4 gap-x-10 gap-y-10'>
      <div class='bg-slate-200/70 rounded-md p-4'>
        <div class='grid grid-cols-2 font-semibold'>
          <div>Temperature:</div>
          <div >26.5 °C</div>

          <div>Humidity:</div>
          <div >40</div>
        </div>

        <div class='mt-2 flex justify-between text-xs'>
          <div class='text-slate-400'>
            Room 1
          </div>
          <div class='text-green-400'>
            Sensor activated
          </div>
        </div>
      </div>
      <div class='bg-slate-200/70 rounded-md p-4'>
        <div class='grid grid-cols-2 font-semibold'>
          <div>Temperature:</div>
          <div >24.5 °C</div>

          <div>Humidity:</div>
          <div >30</div>
        </div>

        <div class='mt-2 flex justify-between text-xs'>
          <div class='text-slate-400'>
            Room 2
          </div>
          <div class='text-red-400'>
            Sensor desactivated
          </div>
        </div>
      </div>
      <div class='bg-slate-200/70 rounded-md p-4'>3</div>
      <div class='bg-slate-200/70 rounded-md p-4'>4</div>

      <div class='bg-red-300 rounded-md p-4'>
        <div class='grid grid-cols-2 font-semibold'>
          <div>Temperature:</div>
          <div >29.3 °C</div>

          <div>Humidity:</div>
          <div >35</div>
        </div>

        <div class='mt-2 flex justify-between text-xs'>
          <div class='text-slate-100'>
            Room 5
          </div>
          <div class='text-red-800'>
            Sensor desactivated
          </div>
        </div>
      </div>
      <div class='bg-slate-200/70 rounded-md p-4'>6</div>
      <div class='bg-red-300 rounded-md p-4'>
        <div class='grid grid-cols-2 font-semibold'>
          <div>Temperature:</div>
          <div >30 °C</div>

          <div>Humidity:</div>
          <div >32</div>
        </div>

        <div class='mt-2 flex justify-between text-xs'>
          <div class='text-slate-100'>
            Room 7
          </div>
          <div class='text-[#209a37]/80'>
            Sensor activated
          </div>
        </div>
      </div>
      <div class='bg-slate-200/70 rounded-md p-4'>8</div>
    </div>
  </div>
  <div class='mt-12 text-xs custom-grid'>
    <div class='font-semibold'>Sensor activated</div>
    <div>: sensor is sending data</div>
    
    <div class='font-semibold'>Sensor desactivated</div>
    <div>: sensor has stop sending data for more than 3 minutes</div>

    <div class='bg-red-300 h-3 rounded-sm'></div>
    <div>: Temperature over 28 °C</div>
  </div>
</div>