<script setup lang="ts">
const props = defineProps({
  options: {
    type: Array as () => Array<{ label: string; value: string | number }>,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Pilih salah satu'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:value'])

const updateValue = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  emit('update:value', value)
}

const model = defineModel()
</script>

<template>
  <div class="flex flex-col w-full space-y-2">
    <div
      class="flex flex-row items-center justify-between px-2 overflow-hidden border border-gray-300 rounded-lg drop-shadow"
      :class="{
        'bg-white': !disabled,
        'bg-gray-200': disabled || readonly
      }"
    >
      <slot name="prefix" />
      <select
        v-model="model"
        :disabled="disabled"
        :readonly="readonly"
        @change="updateValue($event)"
        class="flex-1 w-full py-3 text-sm text-gray-500 bg-transparent bg-white border-0 border-transparent rounded-lg disabled:bg-gray-200 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-0"
      >
        <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <slot name="suffix" />
    </div>
  </div>
</template>
