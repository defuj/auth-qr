<template>
  <div class="relative w-full overflow-hidden bg-white" :class="classes">
    <slot></slot>
    <div class="flex justify-center overflow-hidden no-scroll-bar" :class="[classHeight]">
      <div class="flex flex-col justify-between overflow-hidden h-dvh width-mobile">
        <slot name="header"></slot>
        <div class="flex flex-col items-start flex-1 overflow-y-auto no-scroll-bar">
          <slot name="content"></slot>
        </div>
        <slot name="navigation"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

const props = defineProps({
  class: {
    type: String,
    default: ''
  }
})

const classes = computed(() => {
  const list = props.class.split(' ')
  list.find((item) => item.includes('h-')) ? '' : list.push('h-dvh')
  return list.join(' ')
})

const classHeight = computed(() => {
  return props.class.split(' ').find((item) => item.includes('h-')) ?? 'h-dvh'
})

const emit = defineEmits(['onBackPressed'])

const handleBackButton = () => {
  window.addEventListener('popstate', () => {
    emit('onBackPressed')
  })
}

onMounted(() => {
  handleBackButton()
})
</script>
