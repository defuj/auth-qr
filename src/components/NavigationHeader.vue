<template>
  <div
    class="flex flex-row items-center justify-between w-full px-4 space-x-6 bg-white border-b border-gray-100 h-14"
  >
    <button type="button" @click="onBack">
      <ChevronLeft class="w-6 h-6 text-green-500" />
    </button>
    <span v-if="props.title.length > 0" class="flex-1 text-base font-semibold text-green-800">{{
      props.title
    }}</span>
    <div class="flex flex-row items-center space-x-6">
      <slot name="action" />
    </div>
  </div>
</template>
<script setup lang="ts">
import router from '@/router'
import ChevronLeft from './icons/ChevronLeft.vue'

const emit = defineEmits(['onBack'])
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

const onBack = () => {
  // check if router can go back
  if (router.options.history.state.back) {
    router.back()
  } else {
    router.push('/')
  }
  emit('onBack')
}
</script>
