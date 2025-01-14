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
      if (ctx.data?.event) {
        if (ctx.data?.event === 'qrscan') {
          getJWT(qrData.value)
        }
      }
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
        const uuid = 'dbb62d54-3e53-4f6d-8f37-18a2ae1f4898'
        const websocket_token =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzY5NTM2OTgsInN1YiI6InB1YmxpYzozMyJ9.tjTvG7Ftj3xUFTIU9BDEAxfw1GqLMjFks18wgZBFuuQ'
        const channel_name = 'public:33'

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
