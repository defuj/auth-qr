import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'

export const useNavigationStore = defineStore('navigation', () => {
  const route = useRoute()
  const activeActions = ref<string[]>([])
  const currentRoute = computed(() => route.fullPath)
  const isEmptyActiveActions = computed(() => activeActions.value.length == 0)
  const addActiveAction = (actionID: string) => {
    activeActions.value.push(actionID)
  }
  const removeActiveAction = (actionID: string) => {
    activeActions.value = activeActions.value.filter((a) => a !== actionID)
  }
  const isActiveAction = (actionID: string) => activeActions.value.includes(actionID)
  const generateActionID = (actionName: string) => {
    let result = ''
    if (!actionName) {
      result = Math.random().toString(36)
    }
    result = `${actionName}-${Math.random().toString(36)}`

    return result
  }

  return {
    currentRoute,
    isEmptyActiveActions,
    addActiveAction,
    removeActiveAction,
    isActiveAction,
    generateActionID
  }
})
