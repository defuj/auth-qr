<!-- filepath: /Users/defuj/Developments/Website/vuejs/auth-qr/src/views/Register.vue -->
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div
      class="relative w-full max-w-full p-6 m-6 space-y-8 bg-white shadow-md rounded-3xl md:max-w-md md:p-8 md:m-0"
    >
      <div>
        <h2 class="text-3xl font-extrabold text-center text-gray-900">
          <span class="block text-indigo-600">Create an Account</span>
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="confirmRegister">
        <div class="rounded-md shadow-sm">
          <div>
            <label for="name" class="sr-only">Full Name</label>
            <input
              v-model="fullname"
              id="name"
              name="name"
              type="text"
              autocomplete="name"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Full Name"
            />
          </div>
          <div>
            <label for="username" class="sr-only">Username</label>
            <input
              v-model="username"
              id="username"
              name="username"
              type="text"
              autocomplete="username"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
              required
              class="relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
          <div class="-mt-px">
            <label for="password" class="sr-only">Confirm Password</label>
            <input
              v-model="confirmPassword"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Confirm Password"
            />
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              v-model="terms"
              id="terms"
              name="terms"
              type="checkbox"
              class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label for="terms" class="block ml-2 text-sm text-gray-900"
              >I agree to the terms and conditions</label
            >
          </div>
        </div>
        <div>
          <button
            type="submit"
            class="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Register
          </button>

          <div class="flex items-center justify-center mt-4">
            <span class="text-sm text-gray-600">Already have an account?</span>
            <RouterLink
              to="/login"
              class="ml-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >Login</RouterLink
            >
          </div>
        </div>
      </form>

      <div
        class="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out bg-white rounded-3xl"
        v-if="loading"
      >
        <Progress
          class="w-10 h-10 text-indigo-600 transition-all duration-300 ease-in-out animate-spin"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { requestRegisterData } from '@/api/api'
import { Progress } from '@/components/icons'
import { dispatchNotification } from '@/components/Notification'
import router from '@/router'
import { useDialogStore } from '@/stores/dialog'
import { onMounted, ref } from 'vue'

const dialog = useDialogStore()
const loading = ref<boolean>(false)
const username = ref<string>('')
const fullname = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')
const terms = ref<boolean>(false)

const confirmRegister = () => {
  if (
    username.value === '' ||
    fullname.value === '' ||
    password.value === '' ||
    confirmPassword.value === ''
  ) {
    dispatchNotification({
      title: 'Error',
      content: 'Please fill all fields',
      type: 'error'
    })
  } else if (!terms.value) {
    dispatchNotification({
      title: 'Error',
      content: 'Please agree to the terms and conditions',
      type: 'error'
    })
  } else if (password.value !== confirmPassword.value) {
    dispatchNotification({
      title: 'Error',
      content: 'Password and Confirm Password must be the same',
      type: 'error'
    })
  } else {
    createAccount()
  }
}

const createAccount = async () => {
  loading.value = true
  await requestRegisterData({
    username: username.value,
    fullname: fullname.value,
    password: password.value
  })
    .then((res) => {
      // if status 200, show success message
      // else, show error message
      if (res.status === 200) {
        dialog.createDialog({
          title: 'Success',
          message: 'Successfully created an account',
          type: 'success',
          confirmText: 'OK',
          onConfirm: () => {
            router.replace('/login')
          },
          dismissable: false
        })
      } else {
        dialog.createDialog({
          title: 'Error',
          message: 'Failed to create an account',
          type: 'error',
          confirmText: 'OK'
        })
      }
    })
    .catch((err) => {
      dialog.createDialog({
        title: 'Error',
        message: 'Failed to create an account',
        type: 'error',
        confirmText: 'OK'
      })
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  document.title = 'Create an Account'
})
</script>
