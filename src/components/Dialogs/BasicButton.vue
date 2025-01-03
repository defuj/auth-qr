<template>
  <button
    :type="type"
    @click="onClick"
    :disabled="disabled"
    :class="[
      color === 'green'
        ? 'bg-green-500 hover:bg-green-400 text-white'
        : color === 'white'
          ? 'bg-gray-50 hover:bg-gray-100 text-brown-900'
          : color === 'orange'
            ? 'bg-orange-500 hover:bg-orange-600 text-white'
            : 'bg-red-600 hover:bg-red-700 text-white',
      size === 'big' ? 'h-20 text-xl' : 'text-base h-10',
      props.class
    ]"
    class="flex flex-row items-center justify-center gap-2 px-4 py-4 text-sm font-semibold text-center transition duration-300 ease-in-out border-0 border-transparent rounded-lg"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  type: {
    type: String as () => 'button' | 'submit' | 'reset',
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  color: {
    type: String as () => 'green' | 'white' | 'red' | 'orange',
    default: 'green'
  },
  size: {
    type: String as () => 'default' | 'big',
    default: 'default'
  },
  class: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const onClick = () => {
  emit('click')
}
</script>
