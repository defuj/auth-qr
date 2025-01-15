<!-- filepath: /Users/defuj/Developments/Website/vuejs/auth-qr/src/views/Login.vue -->
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div
      class="relative w-full max-w-full p-6 m-6 space-y-8 bg-white shadow-md rounded-3xl md:max-w-md md:p-8 md:m-0"
    >
      <div>
        <h2 class="text-3xl font-extrabold text-center text-gray-900">
          <span class="block text-indigo-600">Welcome Back!</span>
          <span class="block text-xl">Please Login</span>
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="confirmLogin">
        <div class="rounded-md shadow-sm">
          <div>
            <label for="username" class="sr-only">Username</label>
            <input
              v-model="username"
              id="username"
              name="username"
              type="text"
              autocomplete="username"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Username"
            />
          </div>
          <div class="-mt-px">
            <label for="password" class="sr-only">Password</label>
            <input
              v-model="password"
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember_me"
              name="remember_me"
              type="checkbox"
              class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label for="remember_me" class="block ml-2 text-sm text-gray-900">Remember me</label>
          </div>
          <div class="text-sm">
            <RouterLink
              to="/register"
              href="#"
              class="font-medium text-indigo-600 hover:text-indigo-500"
              >Create an Account</RouterLink
            >
          </div>
        </div>
        <div class="flex flex-col space-y-3">
          <button
            type="submit"
            class="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>

          <RouterLink
            to="qr"
            type="button"
            class="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:text-white group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login with QR
          </RouterLink>
        </div>
      </form>

      <div
        class="absolute inset-0 flex items-center justify-center bg-white rounded-3xl"
        v-if="loading"
      >
        <Progress class="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { requestLoginData } from '@/api/api'
import { Progress } from '@/components/icons'
import { dispatchNotification } from '@/components/Notification'
import router from '@/router'
import { useDialogStore } from '@/stores/dialog'
import { writeData } from '@/utils/storage'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
const dialog = useDialogStore()

const username = ref<string>('')
const password = ref<string>('')
const loading = ref<boolean>(false)

const confirmLogin = () => {
  if (username.value != '' && password.value != '') {
    login()
  } else {
    dispatchNotification({
      title: 'Error',
      content: 'Username and Password cannot be empty',
      type: 'error',
      duration: 3000
    })
  }
}

const login = async () => {
  loading.value = true
  await requestLoginData({
    username: username.value,
    password: password.value
  })
    .then((res) => {
      // check if result 'token' is available
      // if available, save it to localStorage
      // else, show error message
      if (res.data?.token) {
        writeData('access', res.data?.token)
        router.replace('/scan')
      } else {
        dialog.createDialog({
          title: 'Error',
          message: res.data.message ?? 'Something went wrong',
          type: 'error',
          confirmText: 'OK'
        })
      }
      if (res.data.status === 'success') {
        dialog.createDialog({
          title: 'Success',
          message: 'Login Successfully',
          type: 'success',
          confirmText: 'OK'
        })
      } else {
        dialog.createDialog({
          title: 'Error',
          message: res.data.message ?? 'Something went wrong',
          type: 'error',
          confirmText: 'OK'
        })
      }
    })
    .catch((err) => {
      dialog.createDialog({
        title: 'Error',
        message: err.response.data.message ?? 'Something went wrong',
        type: 'error',
        confirmText: 'OK'
      })
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  document.title = 'Login to Your Account'
})
</script>
