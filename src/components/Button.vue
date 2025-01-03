<template>
  <button
    :type="type"
    @click="onClick"
    :disabled="disabled"
    :class="{
      'bg-green-500 text-white hover:bg-green-700 disabled:text-green-100 border-0 outline-none':
        props.color === 'primary',
      'bg-white text-gray-600 disabled:text-gray-400 border border-gray-500':
        props.color === 'secondary'
    }"
    class="flex flex-row items-center justify-center w-full gap-2 px-4 py-3 text-sm font-semibold text-center transition duration-300 ease-in-out rounded-lg"
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
    type: String as () => 'primary' | 'secondary',
    default: 'primary'
  }
})

const emit = defineEmits(['click'])

const onClick = () => {
  emit('click')
}
</script>
