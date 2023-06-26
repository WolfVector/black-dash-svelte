<script>
  import { onDestroy, onMount } from "svelte";
  import { page } from "$app/stores"
  import { browser } from '$app/environment';
  import TopBar from "./TopBar.svelte";
  import mqtt_client from 'u8-mqtt/esm/web/index.js'

  export let data

  let name = $page.data.session?.user?.name || ''
  let my_mqtt = null
  let topicList = [] // To keep the order of the topics
  let topicsObject = {} // To save the data 
  let timeoutList = new Set()

  onMount(async () => {
    if(data.broker !== "no-mqtt") {
      my_mqtt = mqtt_client()
      .with_websock(`${data.broker.url}:${data.broker.port}`)
      // or .with_tcp('tcp://test.mosquitto.org:1883')
      .with_autoreconnect()

      await my_mqtt.connect()

      data.topics.forEach(function(topic) {
        topicList.push(topic.topic) // Add the topic to the order list
        topicsObject[topic.topic] = { titleRoom: topic.title , activated: true, data: {} } // Create an object for the topic
        let selfFields = new Set()
        topic.keyFields.forEach(obj => {
          topicsObject[topic.topic].data[obj.keyField] = {}
          topicsObject[topic.topic].data[obj.keyField].title = obj.fieldTitle
          topicsObject[topic.topic].data[obj.keyField].units = obj.fieldUnits
          selfFields.add(obj.keyField)
        });

        let idInterval = setTimeout(function() {
          topicsObject[topic.topic].activated = false
        }, 180000) // 180000 = 3 minutos

        timeoutList.add(idInterval)

        my_mqtt.subscribe_topic(
        topic.topic,
        async (pkt, params, ctx) => {
          clearTimeout(idInterval)
          timeoutList.delete(idInterval)
          let mqttData = await pkt.json()
          
          Object.keys(mqttData).forEach(key => {
            if(selfFields.has(key))  {
              topicsObject[pkt.topic].data[key].value = mqttData[key] 
              topicsObject[pkt.topic].activated = true
            }
          })

          idInterval = setTimeout(function() {
            topicsObject[pkt.topic].activated = false
          }, 30000) // 30000 = 30 segundos
        
        })

      });
    }
  })

  onDestroy(() => {
    if(browser) {
      my_mqtt.disconnect()
      timeoutList.forEach(key => {
        clearTimeout(key)
      })
    }
  })


</script>

<div class='flex flex-col'>
  <TopBar title="Black Dash" />
  <div class="mt-8 flex justify-end">
    <span class="text-slate-700 font-medium text-sm">{ name }</span>
  </div>
  <div class='grow mt-8'>
    <div class='grid grid-cols-4 gap-x-10 gap-y-10'>
      {#each topicList as topicKey}
        <div class='bg-slate-200/70 rounded-md p-4'>
          <div class='grid grid-cols-2 font-semibold'>
            {#each Object.keys(topicsObject[topicKey].data) as key }
              <div>{ topicsObject[topicKey].data[key].title }</div>
              <div >{ topicsObject[topicKey].data[key].value || '' } { topicsObject[topicKey].data[key].units }</div>
            {/each}
          </div>

          <div class='mt-2 flex justify-between text-xs'>
            <div class='text-slate-400'>
              { topicsObject[topicKey].titleRoom }
            </div>
            <div class='{topicsObject[topicKey].activated ? "text-green-400" : "text-red-400"}'>
              Sensor { topicsObject[topicKey].activated ? "activated" : "desactivated" }
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
  <div class='mt-12 text-xs custom-grid'>
    <div class='font-semibold'>Sensor activated</div>
    <div>: sensor is sending data</div>
    
    <div class='font-semibold'>Sensor desactivated</div>
    <div>: sensor has stop sending data for more than 30 seconds</div>

    <!--<div class='bg-red-300 h-3 rounded-sm'></div>
    <div>: Temperature over 28 °C</div>-->
  </div>
</div>