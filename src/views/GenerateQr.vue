<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div
      class="relative w-full max-w-full p-6 m-6 space-y-8 transition-all duration-300 ease-in-out bg-white shadow-md rounded-3xl md:max-w-md md:p-8 md:m-0"
    >
      <div v-if="qrData && !isLogged">
        <h2
          class="text-2xl font-extrabold text-center text-gray-900 transition-all duration-300 ease-in-out"
        >
          <span class="block"> Scan QR Code Here </span>
        </h2>
      </div>
      <div
        v-if="!isLogged"
        class="space-y-6 transition-all duration-300 ease-in-out"
        :class="{ 'mt-8': qrData }"
      >
        <QRCodeVue3
          v-if="qrData"
          :value="qrData"
          :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }"
          :imageOptions="{ hideBackgroundDots: true, imageSize: 0.4, margin: 0 }"
          :dotsOptions="{
            type: 'rounded',
            color: '#000000'
          }"
          :backgroundOptions="{ color: '#ffffff' }"
          :cornersSquareOptions="{ type: 'extra-rounded', color: '#4f46e5' }"
          :cornersDotOptions="{ type: 'extra-rounded', color: '#4f46e5' }"
          :download="false"
          myclass="w-full h-full transition-all duration-300 ease-in-out transform"
          imgclass="w-full h-auto object-contain transition-all duration-300 ease-in-out transform"
        />

        <div
          v-else
          class="flex flex-col items-center justify-center w-full transition-all duration-300 ease-in-out aspect-1"
        >
          <ErrorIcon class="!w-20 !h-20 text-red-600 transition-all duration-300 ease-in-out" />
          <h1 class="text-lg text-gray-600 transition-all duration-300 ease-in-out">
            Failed to generate QR Code
          </h1>
        </div>

        <RouterLink
          v-if="!loading"
          to="/login"
          type="button"
          class="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-indigo-600 transition-all duration-300 ease-in-out bg-white border border-indigo-600 rounded-md group hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Login
        </RouterLink>
      </div>

      <div
        v-if="loading"
        class="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out delay-150 bg-white rounded-3xl"
      >
        <Progress
          class="w-10 h-10 text-indigo-600 transition-all duration-300 ease-in-out animate-spin"
        />
      </div>

      <div
        v-if="isLogged"
        class="h-fit flex flex-col items-center justify-center transition-all duration-300 ease-in-out bg-white rounded-3xl"
      >
        <svg
          class="w-20 h-20 text-green-500 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2l4 -4"
          />
        </svg>
        <h1 class="mt-4 text-2xl font-bold text-gray-900">Login Successful!</h1>
        <p class="mt-2 text-gray-600">You have successfully logged in.</p>

        <RouterLink
          to="/login"
          type="button"
          class="relative mt-6 flex justify-center w-full px-4 py-2 text-sm font-medium text-green-600 transition-all duration-300 ease-in-out bg-white border border-green-600 rounded-md group hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
        >
          Back to Login
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { requestQRData, requestQrSession } from '@/api/api'
import { Progress } from '@/components/icons'
import { dispatchNotification } from '@/components/Notification'
import { ErrorIcon } from '@/components/Notification/icons'
import { useDialogStore } from '@/stores/dialog'
import { writeData } from '@/utils/storage'
import { Centrifuge, Subscription } from 'centrifuge'
import QRCodeVue3 from 'qrcode-vue3'
import { onMounted, onUnmounted, ref } from 'vue'
const dialog = useDialogStore()
const qrData = ref<string | null>(null)
const loading = ref<boolean>(true)
const isLogged = ref<boolean>(false)

let sub: Subscription
let centrifuge: Centrifuge

const connectWebsocket = (token: string, channel_name: string) => {
  setTimeout(() => {
    isLogged.value = true
  }, 5000)

  centrifuge = new Centrifuge(import.meta.env.VITE_WS_URL, {
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

  sub = centrifuge.newSubscription(channel_name)
  sub
    .on('publication', function (ctx) {
      console.log('Received publish', ctx)
      if (ctx.data?.event) {
        if (ctx.data?.event === 'qrscan') {
          if (qrData.value) {
            getJWT(qrData.value)
          }
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
  await requestQrSession({
    uuid: uuid
  })
    .then((res) => {
      if (res.data?.token) {
        isLogged.value = true
        writeData('access', res.data?.token)

        if (sub) {
          sub.unsubscribe()
        }
        if (centrifuge) {
          centrifuge.disconnect()
        }
      } else {
        dialog.createDialog({
          title: 'Error',
          message: res?.data?.message ?? 'Something went wrong',
          type: 'error',
          confirmText: 'OK'
        })
      }
    })
    .catch((err) => {
      dialog.createDialog({
        title: 'Error',
        message: err ? err.toString() : 'Something went wrong',
        type: 'error'
      })
    })
    .finally(() => {
      dialog.stopProgress()
    })
}

onUnmounted(() => {
  if (sub) {
    sub.unsubscribe()
  }
  if (centrifuge) {
    centrifuge.disconnect()
  }
})

onMounted(async () => {
  document.title = 'Scan QR'
  loading.value = true
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
        dispatchNotification({
          title: 'Error',
          content: 'Failed to get QR Data',
          type: 'error',
          duration: 3000
        })
      }
    })
    .catch((err) => {
      dispatchNotification({
        title: 'Error',
        content: err ? err.toString() : 'Something went wrong',
        type: 'error',
        duration: 3000
      })
    })
    .finally(() => {
      loading.value = false
    })

  if (import.meta.env.DEV) {
    const uuid = 'dbb62d54-3e53-4f6d-8f37-18a2ae1f4898'
    const websocket_token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzY5NTM2OTgsInN1YiI6InB1YmxpYzozMyJ9.tjTvG7Ftj3xUFTIU9BDEAxfw1GqLMjFks18wgZBFuuQ'
    const channel_name = 'public:33'

    qrData.value = uuid
    connectWebsocket(websocket_token, channel_name)
  }
})
</script>
