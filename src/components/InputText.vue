<script setup lang="ts">
const props = defineProps({
  type: {
    type: String as () => 'text' | 'password' | 'email' | 'phone' | 'number',
    default: 'text'
  },
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
    default: 50
  }
})

const emit = defineEmits(['update:value'])

const updateValue = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:value', value)
}

const model = defineModel()
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
      <input
        v-model="model"
        autocomplete="off"
        :type="type"
        :placeholder="placeholder"
        @input="updateValue($event)"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="type === 'phone' ? 15 : maxlength"
        class="flex-1 w-full px-0 py-3 text-sm text-gray-500 bg-transparent bg-white border-0 border-transparent rounded-lg autofill:!bg-white autofill:focus:bg-white disabled:bg-gray-200 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-0"
      />
      <slot name="suffix" />
    </div>
  </div>
</template>
