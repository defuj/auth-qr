<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-40 h-dvh">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
      </TransitionChild>

      <div class="fixed inset-0 flex overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="fixed bottom-0 left-0 right-0 flex max-h-full mx-auto pointer-events-auto width-mobile"
          >
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enter-from="translate-y-full"
              enter-to="translate-y-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leave-from="translate-y-0"
              leave-to="translate-y-full"
            >
              <DialogPanel
                class="w-screen transition-all transform bg-white shadow-xl pointer-events-auto rounded-t-2xl"
              >
                <div class="flex flex-col justify-between max-h-[90vh] items-center">
                  <span class="w-10 h-1 my-4 bg-gray-300 rounded-full"></span>
                  <div
                    class="flex flex-col flex-1 w-full px-4 overflow-x-hidden overflow-y-auto no-scroll-bar"
                  >
                    <slot></slot>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  }
})
const navigation = useNavigationStore()
const key = navigation.generateActionID('bottom-sheet')
const emit = defineEmits(['onClose'])
const open = ref(computed(() => props.open))
const onClose = () => {
  emit('onClose')
}

const handlePopState = (event: PopStateEvent) => {
  onClose()
}

watch(
  () => props.open,
  (value) => {
    if (value) {
      window.addEventListener('popstate', handlePopState)
      navigation.addActiveAction(key)
    } else {
      window.removeEventListener('popstate', handlePopState)
      navigation.removeActiveAction(key)
    }
  }
)
</script>
