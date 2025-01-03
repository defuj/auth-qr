<template>
  <LayoutProvider>
    <template #content>
      <div class="flex flex-col items-center justify-center h-full p-6">
        <h1 class="text-lg font-bold text-center">Browser Tidak Didukung</h1>
        <p class="mt-4 text-sm text-center">
          Maaf, browser yang Anda gunakan tidak didukung oleh aplikasi ini. Silakan gunakan browser
          lain.
        </p>
      </div>
    </template>
  </LayoutProvider>
</template>

<script setup lang="ts">
import LayoutProvider from '@/components/LayoutProvider.vue'
</script>
