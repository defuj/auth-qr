<template>
  <div class="flex flex-col items-start w-full gap-3" id="file-drag">
    <div v-if="openCamera" class="flex flex-col w-full space-y-4">
      <div class="relative w-full overflow-hidden rounded-lg">
        <Camera
          class="w-full h-full"
          :resolution="{ width: cameraWidth, height: cameraWidth }"
          autoplay
          ref="camera"
        ></Camera>

        <div class="absolute top-0 w-full h-full group" @click="changeCamera">
          <div
            class="flex flex-col items-center justify-center w-full h-full transition duration-300 bg-transparent bg-opacity-100 cursor-pointer group-hover:bg-black group-hover:bg-opacity-50"
          >
            <span
              class="text-2xl text-white transition duration-300 text-opacity-10 group-hover:text-opacity-50"
              >Ganti kamera</span
            >
          </div>
        </div>
      </div>
      <div class="flex flex-row justify-between w-full space-x-3">
        <Button color="secondary" @click="openCamera = false">Tutup</Button>
        <Button color="primary" @click="snapshot">Ambil Foto</Button>
      </div>
    </div>
    <button
      v-else
      class="flex flex-col items-center w-full gap-1 p-4 bg-white border border-gray-400 border-dashed rounded-md"
      @click.prevent="onFileInputClick"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <div v-if="file" class="relative flex flex-col items-center justify-center w-full">
        <template v-if="isImageFile">
          <img :src="previewUrl" alt="Preview" class="object-contain w-full h-auto" />
        </template>
        <template v-else-if="isPdfFile">
          <FilePdf class="h-40 text-gray-700" />
        </template>
        <p v-if="file" class="mt-2 text-sm text-gray-500">{{ file.name }}</p>
        <button @click.prevent="removeFile" class="absolute top-0 right-0 p-1 rounded-full">
          <RemoveImage class="w-8 h-8" />
        </button>
      </div>
      <div v-else class="relative flex flex-col items-center justify-center w-full">
        <AddImage class="size-12" v-if="props.target == 'file'" />
        <CameraIcon class="size-12" v-else />
        <p class="text-sm font-medium text-green-800">
          {{ props.target == 'file' ? 'Upload a file' : 'Take a Picture' }}
        </p>
        <div v-if="props.target == 'file'">
          <p class="text-xs font-normal text-gray-500" v-if="props.accept == 'application/pdf'">
            PDF up to 10MB
          </p>
          <p class="text-xs font-normal text-gray-500" v-else>PDF, PNG, JPG, JPEG up to 10MB</p>
        </div>
      </div>
    </button>
    <input
      v-if="props.target == 'file'"
      ref="fileInput"
      type="file"
      class="hidden"
      @change="handleFileChange"
      :key="fileInputValue"
      :accept="props.accept"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'
import { AddImage, RemoveImage, FilePdf } from '@/components/icons'
import CameraIcon from './icons/CameraIcon.vue'
import Camera from 'simple-vue-camera'
import { dispatchNotification } from './Notification'
import moment from 'moment'
import Button from './Button.vue'

const openCamera = ref<boolean>(false)
const camera = ref<InstanceType<typeof Camera>>()
const picture = ref<Blob | null | undefined>(null)
const previewUrl = ref('')
const fileInputValue = ref(0)
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const removingFile = ref(false)
const isImageFile = computed(() => file.value?.type.startsWith('image/'))
const isPdfFile = computed(() => file.value?.type === 'application/pdf')
const cameraWidth = computed(() => window.innerWidth - 32)

const props = defineProps({
  accept: {
    type: String,
    default: 'image/*, application/pdf '
  },
  target: {
    type: String as PropType<'file' | 'camera'>,
    default: 'file'
  }
})
const emit = defineEmits(['file-selected'])

const selectCamera = async (cameraId: string) => {
  if (import.meta.env.DEV) {
    console.log('cameraId', cameraId)
  }
  await camera.value?.changeCamera(cameraId)
}

const changeCamera = async () => {
  const devices = (await camera.value?.devices()) ?? []
  const currentDeviceID = camera.value?.currentDeviceID()
  if (devices.length > 1) {
    const videoDevices = devices.filter((device) => device.kind === 'videoinput')
    const nextDevice = videoDevices.find((device) => device.deviceId !== currentDeviceID)
    selectCamera(nextDevice?.deviceId ?? currentDeviceID ?? '')
  }
}

const snapshot = async () => {
  picture.value = await camera.value?.snapshot()

  if (picture.value) {
    file.value = new File([picture.value as Blob], `${moment().valueOf()}-snapshot.jpg`, {
      type: 'image/jpeg'
    })
    previewUrl.value = URL.createObjectURL(file.value)
    openCamera.value = false
    emit('file-selected', file.value)
  } else {
    dispatchNotification({
      title: 'Gagal mengambil foto',
      content: 'Silahkan coba lagi',
      type: 'error'
    })
    openCamera.value = false
  }
}

const triggerFileInput = () => {
  if (props.target == 'file') {
    fileInput.value?.click()
  } else {
    openCamera.value = true
  }
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    handleFile(target.files[0])
  }
}

const onDragOver = (event: DragEvent) => {
  if (props.target == 'file') {
    const element = event.currentTarget as HTMLElement
    element.classList.add('hover')
  }
}

const onDragLeave = (event: DragEvent) => {
  if (props.target == 'file') {
    const element = event.currentTarget as HTMLElement
    element.classList.remove('hover')
  }
}

const onDrop = (event: DragEvent) => {
  if (props.target == 'file') {
    const files = event.dataTransfer?.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }
}

const handleFile = (selectedFile: File) => {
  if (selectedFile.type.startsWith('image/')) {
    file.value = selectedFile
    const reader = new FileReader()
    reader.onload = () => {
      previewUrl.value = reader.result as string
    }
    reader.readAsDataURL(selectedFile)
    emit('file-selected', selectedFile)
  } else if (selectedFile.type === 'application/pdf') {
    file.value = selectedFile
    previewUrl.value = ''
    emit('file-selected', selectedFile)
  } else {
    // Swal.fire({
    //   icon: 'error',
    //   title: 'Ekstensi Tidak Cocok',
    //   text: 'Hanya file gambar (PNG, JPG, JPEG) atau PDF yang diizinkan!'
    // })
    alert('Hanya file gambar (PNG, JPG, JPEG) atau PDF yang diizinkan!')
    file.value = null
  }
}

const removeFile = () => {
  file.value = null
  previewUrl.value = ''
  removingFile.value = true
  fileInputValue.value += 1
}

const onFileInputClick = () => {
  if (!file.value && !removingFile.value) {
    triggerFileInput()
  } else if (removingFile.value) {
    removingFile.value = false
  }
}
</script>

<style scoped>
.hover {
  border-color: #2f855a;
}
</style>
