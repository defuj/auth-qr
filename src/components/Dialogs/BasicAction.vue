<template>
  <DialogPanel
    class="relative w-full max-w-sm p-4 overflow-hidden text-left transition-all transform bg-white shadow-xl min-w-80 rounded-2xl"
  >
    <!-- <div class="flex flex-row items-center justify-end">
      <button type="button" class="p-1 bg-transparent rounded-full" @click="close">
        <Close />
      </button>
    </div> -->

    <div>
      <div class="flex items-center justify-center mx-auto w-[100px] h-[100px] my-3">
        <Question v-if="type === 'error'" />
        <Success v-else-if="type === 'success'" class="text-green-500" />
        <Warning v-else-if="type === 'warning' || type === 'confirm'" />
      </div>
      <div class="text-center">
        <h1 class="text-lg font-bold text-center text-black">
          {{ title }}
        </h1>
        <p class="text-sm font-medium text-center text-gray-800">
          {{ message }}
        </p>
      </div>
    </div>

    <div
      v-if="type === 'error' || type === 'warning' || type === 'confirm'"
      class="flex gap-4 mt-4"
      :class="[showNeutralButton && showCancelButton ? 'flex-col' : 'flex-row justify-between']"
    >
      <BasicButton
        :color="
          type == 'error' ? 'red' : type === 'warning' || type === 'confirm' ? 'orange' : 'green'
        "
        @click="handleOnConfirm"
        class="flex-1"
      >
        {{ confirmText }}
      </BasicButton>

      <BasicButton
        v-if="showNeutralButton"
        color="white"
        @click="handleOnNeutral()"
        class="flex-1 !bg-gray-200"
      >
        {{ neutralText }}
      </BasicButton>

      <BasicButton v-if="showCancelButton" color="white" @click="handleOnCancel()" class="flex-1">
        {{ cancelText }}
      </BasicButton>
    </div>
    <div v-else class="flex flex-row items-center justify-between mt-4 space-x-4">
      <BasicButton color="green" @click="handleOnConfirm" class="flex-1">
        {{ confirmText }}
      </BasicButton>

      <BasicButton v-if="showCancelButton" color="white" @click="handleOnCancel" class="flex-1">
        {{ cancelText }}
      </BasicButton>
    </div>
  </DialogPanel>
</template>

<script setup lang="ts">
import { DialogPanel } from '@headlessui/vue'
import { computed, ref } from 'vue'
import { Question, Success, Warning } from '../icons'
import BasicButton from './BasicButton.vue'
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  cancelText: {
    type: String,
    default: 'Batal'
  },
  confirmText: {
    type: String,
    default: 'Oke'
  },
  neutralText: {
    type: String,
    default: 'Tutup'
  },
  showNeutralButton: {
    type: Boolean,
    default: false
  },
  showCancelButton: {
    type: Boolean,
    default: true
  },
  type: {
    type: String as () => 'normal' | 'warning' | 'error' | 'success' | 'confirm',
    default: 'normal'
  }
})
const emits = defineEmits(['onClose', 'onCancel', 'onConfirm', 'onNeutral'])
const title = ref(computed(() => props.title))
const message = ref(computed(() => props.message))
const cancelText = ref(computed(() => props.cancelText))
const confirmText = ref(computed(() => props.confirmText))
const type = ref(computed(() => props.type))

const close = () => {
  emits('onClose')
}

const handleOnCancel = () => {
  close()
  emits('onCancel')
}

const handleOnConfirm = () => {
  close()
  emits('onConfirm')
}

const handleOnNeutral = () => {
  close()
  emits('onNeutral')
}
</script>
