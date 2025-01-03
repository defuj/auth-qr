<template>
  <div class="flex flex-row items-center justify-between">
    <DialogTitle as="h1" class="flex flex-1 text-2xl font-semibold text-brown-900">
      {{ props.title }}
    </DialogTitle>
    <button type="button" class="p-1 bg-transparent rounded-full" @click="close">
      <Close />
    </button>
  </div>
</template>

<script setup lang="ts">
import { DialogTitle } from '@headlessui/vue'
import { Close } from '../icons'
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})
const emits = defineEmits(['onClose'])
const close = () => emits('onClose', false)
</script>
