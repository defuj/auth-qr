import { createRouter, createWebHistory } from 'vue-router'
import Auth from '@/views/Auth.vue'
import NotSupported from '@/views/NotSupported.vue'
import Scan from '@/views/Scan.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/not-support',
      name: 'Not Support',
      component: NotSupported
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth
    },
    {
      path: '/scan',
      name: 'Scan',
      component: Scan,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    }
  ]
})

const isBrowserSupport = () => {
  const isEdge = /Edge/.test(navigator.userAgent)
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
  const isFirefox = /Firefox/.test(navigator.userAgent)
  const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)

  if (isEdge) {
    return false
  }

  if (isChrome || isFirefox || isSafari) {
    return true
  }

  return false
}

router.beforeEach((to, from, next) => {
  // Check if browser is supported
  if (!isBrowserSupport()) {
    if (to.path !== '/not-support') {
      next('/not-support')
      return
    }
  }

  // Redirect to main page if user access not supported page
  if (to.path === '/not-support') {
    next('/scan')
    return
  }

  // Redirect to home page if user access not found page
  if (to.matched.length === 0) {
    next('/scan')
    return
  }

  next()
})

export default router
