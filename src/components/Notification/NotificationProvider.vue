<script setup lang="ts">
import Notification from './Notification.vue';
import store from './store';
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-start justify-end px-4 py-6 pointer-events-none sm:p-6">
    <div class="w-full max-w-sm">
      <TransitionGroup appear tag="div"
        :enter-active-class="store.getters.getNotificationsCount() > 1 ? 'transform ease-out delay-300 duration-300 transition' : 'transform ease-out duration-300 transition'"
        enter-from-class="translate-x-4 opacity-0" enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0"
        move-class="transition duration-500 ease-in-out">
        <Notification :key="notification.id" :notification="notification" :class="idx > 0 ? 'mt-4' : ''"
          v-for="(notification, idx) in store.getters.getNotifications()" />
      </TransitionGroup>
    </div>
  </div>
  <slot></slot>
</template>

<style scoped>
.delay-300 {
  transition-delay: 300ms;
}
</style>
