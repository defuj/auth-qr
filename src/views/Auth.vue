<template>
  <LayoutProvider v-if="!loading">
    <template #content>
      <div class="flex flex-col items-center justify-center w-full h-full space-y-4 bg-white">
        <div class="text-2xl font-semibold text-center text-gray-800">
          {{ isLogged ? 'Login Successfully' : 'Scan QR' }}
        </div>

        <QRCodeVue3
          v-if="!isLogged"
          :width="300"
          :height="300"
          :value="qrData"
          :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }"
          :imageOptions="{ hideBackgroundDots: true, imageSize: 0.4, margin: 0 }"
          :dotsOptions="{
            type: 'rounded',
            color: '#000000'
          }"
          :backgroundOptions="{ color: '#ffffff' }"
          :cornersSquareOptions="{ type: 'extra-rounded', color: '#000000' }"
          :cornersDotOptions="{ type: 'extra-rounded', color: '#000000' }"
          :download="false"
          myclass=""
          imgclass=""
        />
      </div>
    </template>
  </LayoutProvider>
</template>

<script setup lang="ts">
import { requestQRData, requestQrSession } from '@/api/api'
import LayoutProvider from '@/components/LayoutProvider.vue'
import { useDialogStore } from '@/stores/dialog'
import { writeData } from '@/utils/storage'
import { Centrifuge } from 'centrifuge'
import QRCodeVue3 from 'qrcode-vue3'
import { onMounted, ref } from 'vue'
const dialog = useDialogStore()
const qrData = ref<string>('Hello World')
const loading = ref<boolean>(true)
const isLogged = ref<boolean>(false)

const connectWebsocket = (token: string, channel_name: string) => {
  const centrifuge = new Centrifuge(import.meta.env.VITE_WS_URL, {
    token: token
  })

  centrifuge
    .on('connecting', function (ctx) {
      console.log(`Connecting to WebSocket`, ctx)
    })
    .on('connected', function (ctx) {
      console.log(`Connected to WebSocket`, ctx)
    })
    .on('disconnected', function (ctx) {
      console.log(`Disconnected from WebSocket`, ctx)
    })
    .connect()

  const sub = centrifuge.newSubscription(channel_name)
  sub
    .on('publication', function (ctx) {
      console.log('Received publish', ctx)
    })
    .on('subscribing', function (ctx) {
      console.log(`Subscribing to channel`, ctx)
    })
    .on('subscribed', function (ctx) {
      console.log('Subscribed to channel', ctx)
    })
    .on('unsubscribed', function (ctx) {
      console.log(`Unsubscribed from channel`, ctx)
    })
    .on('error', function (ctx) {
      console.log(`error`, ctx)
    })
    .subscribe()

  // const sub = centrifuge.newSubscription(channel_name)
  // sub.on('publication', (data) => {
  //   // getJWT(data.data.uuid)
  //   console.log('Publication', data)
  // })
  // // Listen and handle events
  // centrifuge.on('connected', (context) => {
  //   console.log('Connected to WebSocket', context)
  // })

  // centrifuge.on('disconnected', (context) => {
  //   console.log('Disconnected from WebSocket', context)
  // })

  // centrifuge.on('message', (message) => {
  //   console.log('Received message', message)
  // })

  // centrifuge.on('publication', (message) => {
  //   console.log('Received publish', message)
  // })

  // centrifuge.on('join', (message) => {
  //   console.log('User joined', message)
  // })

  // centrifuge.on('leave', (message) => {
  //   console.log('User left', message)
  // })

  // centrifuge.on('subscribed', (context) => {
  //   console.log('Subscribed to channel', context)
  // })

  // centrifuge.on('unsubscribed', (context) => {
  //   console.log('Unsubscribed from channel', context)
  // })

  // centrifuge.connect()
}

const getJWT = async (uuid: string) => {
  dialog.startProgress()
  await requestQrSession({
    uuid: uuid
  })
    .then((res) => {
      if (res.data?.token) {
        isLogged.value = true
        writeData('access', res.data?.token)

        dialog.createDialog({
          title: 'Success',
          message: 'Successfully logged in',
          type: 'success',
          confirmText: 'OK'
        })
      } else {
        dialog.createDialog({
          title: 'Error',
          message: res.data.message ?? 'Something went wrong',
          type: 'error',
          confirmText: 'OK'
        })
      }
    })
    .catch((err) => {
      dialog.createDialog({
        title: 'Error',
        message: err.response.data.message,
        type: 'error'
      })
    })
    .finally(() => {
      dialog.stopProgress()
    })
}

onMounted(async () => {
  document.title = 'Scan QR'
  loading.value = true
  dialog.startProgress()
  await requestQRData()
    .then((res) => {
      if (import.meta.env.DEV) {
        const uuid = '7bc8e087-797b-4b17-a479-3a249b6759e1'
        const websocket_token =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mzk0NTU1NzQsInN1YiI6Ilx0In0.bKKUKe4I3OZoUKXUOhnqd07jVEwioJdN20JFGDbqJro'
        const channel_name = 'user:9'

        qrData.value = uuid
        connectWebsocket(websocket_token, channel_name)
      } else if (res.data?.uuid && res.data?.websocket_token && res.data?.channel_name) {
        qrData.value = res.data?.uuid
        connectWebsocket(res.data?.websocket_token, res.data?.channel_name)
      } else {
        dialog.createDialog({
          title: 'Error',
          message: 'Failed to get QR Data',
          type: 'error'
        })
      }
    })
    .catch((err) => {
      dialog.createDialog({
        title: 'Error',
        message: err.response.data.message,
        type: 'error'
      })
    })
    .finally(() => {
      dialog.stopProgress()
      loading.value = false
    })
})
</script>
