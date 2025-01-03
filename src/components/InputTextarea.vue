<script setup lang="ts">
const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: Number,
    default: 500
  },
  rows: {
    type: Number,
    default: 3
  }
})

const emit = defineEmits(['update:value'])

const updateValue = (event: Event) => {
  const value = (event.target as HTMLTextAreaElement).value
  emit('update:value', value)
}

const model = defineModel<any>()
</script>

<template>
  <div class="flex flex-col w-full space-y-2">
    <div
      class="flex flex-row items-center justify-between px-4 overflow-hidden border border-gray-300 rounded-lg drop-shadow"
      :class="{
        'bg-white': !disabled,
        'bg-gray-200': disabled
      }"
    >
      <slot name="prefix" />
      <textarea
        v-model="model"
        autocomplete="off"
        :placeholder="placeholder"
        :rows="rows"
        @input="updateValue($event)"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        class="flex-1 w-full px-0 py-3 text-sm text-gray-500 bg-transparent bg-white border-0 border-transparent rounded-lg autofill:!bg-white autofill:focus:bg-white disabled:bg-gray-200 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-0 resize-none"
      ></textarea>
      <slot name="suffix" />
    </div>
  </div>
</template>
