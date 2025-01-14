<template>
  <LayoutProvider v-if="!openCamera" class="!bg-gray-400">
    <template #content>
      <div
        class="flex flex-col items-center justify-center w-full h-full p-4 space-y-4 bg-gray-100"
      >
        <h1 class="text-lg font-semibold text-center">Tap to Scan</h1>
        <button @click="startScanning" class="p-3 mt-2 shadow-md rounded-xl w-fit h-fit">
          <QrCode class="w-20 h-20 mx-auto" />
        </button>

        <h1 v-if="codeResult !== ''" class="text-xl font-semibold text-center">
          Result : {{ codeResult }}
        </h1>
      </div>
    </template>
  </LayoutProvider>

  <LayoutProvider v-if="openCamera" class="!bg-gray-400">
    <template #content>
      <div class="flex flex-col items-center justify-center w-full h-full" id="mobile-layout">
        <div class="relative w-full h-full overflow-hidden bg-black">
          <QrcodeStream @detect="onDetect" @camera-on="onCameraOn" :torch="torchActive" />
          <div
            class="absolute inset-0 bg-black bg-opacity-70 before:bg-transparent before:mx-10 before:content-[''] before:absolute before:aspect-1 before:w-[calc(100%-80px)] before:rounded-lg before:bg-clip-content flex flex-col justify-center items-center"
          >
            <div class="relative flex flex-col items-center justify-center w-full h-full">
              <div class="absolute inset-0 flex flex-col items-center justify-center p-8 space-y-4">
                <h1 class="text-lg text-white">Scan Kode QR Code di Sini</h1>
                <div class="w-full aspect-1"></div>
              </div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="relative w-full m-10 aspect-1">
                  <div class="absolute inset-0 rounded-lg border-corners"></div>
                </div>
              </div>

              <div class="absolute inset-0 flex items-center justify-center">
                <div class="relative w-full m-10 aspect-1">
                  <div class="absolute inset-0 rounded-lg border-corners-2"></div>
                </div>
              </div>
            </div>
          </div>

          <button
            @click="openCamera = false"
            class="absolute top-0 left-0 flex items-center justify-center w-10 h-10 m-2 bg-black bg-opacity-50 rounded-full cursor-pointer"
          >
            <CloseIcon class="w-6 h-6 text-white" />
          </button>

          <button
            @click="onFlashlight"
            class="absolute top-0 right-0 flex items-center justify-center w-10 h-10 m-2 bg-black bg-opacity-50 rounded-full cursor-pointer"
          >
            <FlashlightOn v-if="torchActive" class="w-6 h-6 text-white" />
            <Flashlight v-else class="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </template>
  </LayoutProvider>
</template>

<style scoped>
/* Custom CSS to create the transparent hole */
.bg-black.bg-opacity-70::before {
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
}
/* for border top left & border bottom right */
.border-corners::before,
.border-corners::after {
  content: '';
  position: absolute;
  width: 36px;
  height: 36px;
  border: 4px solid white;
  border-top-left-radius: 10px;
}

.border-corners::before {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}

.border-corners::after {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}

.border-corners::before,
.border-corners::after {
  content: '';
  position: absolute;
  width: 36px;
  height: 36px;
  border: 4px solid white;
  border-bottom-right-radius: 10px;
}

.border-corners::before {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}

.border-corners::after {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}

.border-corners::before,
.border-corners::after {
  content: '';
  position: absolute;
  width: 36px;
  height: 36px;
  border: 4px solid white;
  border-bottom-right-radius: 10px;
}

.border-corners::before {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}

.border-corners::after {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}

/* for border top right & bottom left */
.border-corners-2::before,
.border-corners-2::after {
  content: '';
  position: absolute;
  width: 36px;
  height: 36px;
  border: 4px solid white;
  border-top-right-radius: 10px;
}

.border-corners-2::before {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.border-corners-2::after {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}

/* bottom right border */
.border-corners-2::before,
.border-corners-2::after {
  content: '';
  position: absolute;
  width: 36px;
  height: 36px;
  border: 4px solid white;
  border-bottom-left-radius: 10px;
}

.border-corners-2::before {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.border-corners-2::after {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}

.border-corners-2::before,
.border-corners-2::after {
  content: '';
  position: absolute;
  width: 36px;
  height: 36px;
  border: 4px solid white;
  border-bottom-left-radius: 10px;
}

.border-corners-2::before {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.border-corners-2::after {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}
</style>

<script setup lang="ts">
import { QrcodeStream } from 'vue-qrcode-reader'
import LayoutProvider from '@/components/LayoutProvider.vue'
import { onMounted, ref } from 'vue'
import { CloseIcon } from '@/components/Notification/icons'
import QrCode from '@/components/icons/QrCode.vue'
import Flashlight from '@/components/icons/Flashlight.vue'
import { requestByQr } from '@/api/api'
import { useDialogStore } from '@/stores/dialog'
import { dispatchNotification } from '@/components/Notification'
import FlashlightOn from '@/components/icons/FlashlightOn.vue'

const selected = ref(null as MediaDeviceInfo | null)
const devices = ref([] as MediaDeviceInfo[])

const torchActive = ref(false)
const torchSupported = ref(false)
const openCamera = ref<boolean>(false)
const screenWidth = ref(window.innerWidth)
const screenHeight = ref(window.innerHeight)
const codeResult = ref<string>('')
const dialog = useDialogStore()

const onDetect = async (code: string) => {
  if (code !== '') {
    openCamera.value = false
    codeResult.value = code
    // Do something with the detected code
    dialog.startProgress()
    await requestByQr({
      uuid: code
    })
      .then((res) => {
        // if result 'uuid' is available, save it to localStorage
        // else, show error message
        if (res.data?.uuid) {
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
        console.log(err)
        dialog.createDialog({
          title: 'Error',
          message: err.response.data.message ?? 'Something went wrong',
          type: 'error',
          confirmText: 'OK'
        })
      })
      .finally(() => {
        dialog.stopProgress()
      })
  }
}

const onCameraOn = (capabilities: any) => {
  torchSupported.value = !!capabilities.torch
}

const onFlashlight = () => {
  if (torchSupported.value) {
    torchActive.value = !torchActive.value
  } else {
    dispatchNotification({
      content: 'Torch not supported',
      type: 'error',
      duration: 3000,
      title: 'Error'
    })
  }
}

const startScanning = async () => {
  openCamera.value = true
}

onMounted(async () => {
  let cam = document.getElementById('mobile-layout')
  if (cam) {
    console.log('cam width', cam.clientWidth)
    screenWidth.value = cam.clientWidth
    screenHeight.value = cam.clientHeight
  }

  devices.value = (await navigator.mediaDevices.enumerateDevices()).filter(
    ({ kind }) => kind === 'videoinput'
  )

  if (devices.value.length > 0) {
    selected.value = devices.value[0]
  }
})
</script>
