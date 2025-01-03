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
import { requestJWTData, requestQRData } from '@/api/api'
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

const connectWebsocket = (token: string) => {
  const centrifuge = new Centrifuge(import.meta.env.VITE_WS_URL, {
    token: token
  })

  const sub = centrifuge.newSubscription(qrData.value)
  sub.on('publication', (data) => {
    getJWT(data.data.uuid)
  })

  // Listen and handle events
  centrifuge.on('connected', (context) => {
    console.log('Connected to WebSocket', context)
  })

  centrifuge.on('disconnected', (context) => {
    console.log('Disconnected from WebSocket', context)
  })

  centrifuge.on('message', (message) => {
    console.log('Received message', message)
  })

  centrifuge.on('publication', (message) => {
    console.log('Received publish', message)
  })

  centrifuge.on('join', (message) => {
    console.log('User joined', message)
  })

  centrifuge.on('leave', (message) => {
    console.log('User left', message)
  })

  centrifuge.on('subscribed', (context) => {
    console.log('Subscribed to channel', context)
  })

  centrifuge.on('unsubscribed', (context) => {
    console.log('Unsubscribed from channel', context)
  })

  centrifuge.connect()
}

const getJWT = async (uuid: string) => {
  dialog.startProgress()
  await requestJWTData({
    uuid: uuid
  })
    .then((res) => {
      if (res.data?.token) {
        isLogged.value = true
        writeData('token', res.data?.token)
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
  loading.value = true
  dialog.startProgress()
  await requestQRData()
    .then((res) => {
      qrData.value = res.data?.uuid ?? 'Hello World'
      connectWebsocket(res.data?.token ?? '')
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
