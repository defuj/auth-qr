<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NotificationProvider } from '@/components/Notification'
import { onMounted, ref, watch } from 'vue'
import { useDialogStore } from '@/stores/dialog'
import DialogProgress from '@/components/Dialogs/DialogProgress.vue'
import DialogProvider from '@/components/Dialogs/DialogProvider.vue'
import BasicAction from '@/components/Dialogs/BasicAction.vue'
const dialog = useDialogStore()

const showUpdate = ref(false)

const refreshApp = () => {
  navigator.serviceWorker.getRegistration().then((registration) => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  })
}

watch(
  () => showUpdate.value,
  (value) => {
    if (value) {
      refreshApp()
    }
  }
)

onMounted(async () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Reload halaman saat service worker baru aktif
      window.location.reload()
    })

    navigator.serviceWorker.ready.then((registration) => {
      if (registration?.waiting) {
        showUpdate.value = true
      }
    })
  }
})
</script>

<template>
  <NotificationProvider>
    <RouterView />
    <DialogProgress :open="dialog.isProgress" />

    <DialogProvider
      :open="dialog.open"
      @onClose="dialog.open = false"
      :dismissable="dialog.dismissOnAction"
    >
      <BasicAction
        :title="dialog.title"
        :message="dialog.message"
        :type="dialog.type"
        :showCancelButton="dialog.showCancelButton"
        :showNeutralButton="dialog.showNeutralButton"
        :cancelText="dialog.cancelText"
        :confirmText="dialog.confirmText"
        :neutralText="dialog.neutralText"
        @onNeutral="
          () => {
            dialog.onNeutral && dialog.onNeutral()
          }
        "
        @onClose="dialog.hide()"
        @onCancel="
          () => {
            dialog.onCancel && dialog.onCancel()
          }
        "
        @onConfirm="
          () => {
            dialog.onConfirm && dialog.onConfirm()
          }
        "
      />
    </DialogProvider>
  </NotificationProvider>
</template>
