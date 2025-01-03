import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDialogStore = defineStore('dialog', () => {
  const isProgress = ref(false)
  const onConfirm = ref<Function>()
  const onCancel = ref<Function>()
  const onNeutral = ref<Function>()
  const confirmText = ref('')
  const cancelText = ref('')
  const neutralText = ref('')
  const open = ref(false)
  const title = ref('')
  const message = ref('')
  const type = ref<'normal' | 'warning' | 'error' | 'success' | 'confirm'>('normal')
  const showCancelButton = ref(false)
  const showNeutralButton = ref(false)
  const dismissOnAction = ref(false)

  const startProgress = () => {
    isProgress.value = true
  }

  const stopProgress = () => {
    isProgress.value = false
  }

  const show = () => {
    open.value = true
  }

  const createDialog = ({
    title = '',
    message = '',
    type = 'normal',
    confirmText = 'Ok',
    cancelText = '',
    neutralText = '',
    dismissable = false,
    onCancel = () => {},
    onConfirm = () => {},
    onNeutral = () => {}
  }: {
    title?: string
    message?: string
    type?: 'normal' | 'warning' | 'error' | 'success' | 'confirm'
    confirmText?: string
    cancelText?: string
    neutralText?: string
    dismissable?: boolean
    onCancel?: Function
    onConfirm?: Function
    onNeutral?: Function
  }) => {
    dismissOnAction.value = dismissable
    showCancelButton.value = !!cancelText
    showNeutralButton.value = !!neutralText

    setTitles(title, message)
    setType(type)
    setConfirmAction(onConfirm)
    setCancelAction(onCancel)
    setNeutralAction(onNeutral)
    setConfirmText(confirmText)
    setCancelText(cancelText)
    setNeutralText(neutralText)
    show()
  }

  const setNeutralText = (text: string) => {
    neutralText.value = text
  }

  const setNeutralAction = (action: Function) => {
    onNeutral.value = action
  }

  const setCancelAction = (action: Function) => {
    onCancel.value = action
  }

  const setConfirmAction = (action: Function) => {
    onConfirm.value = action
  }

  const setConfirmText = (text: string) => {
    confirmText.value = text
  }

  const setCancelText = (text: string) => {
    cancelText.value = text
  }

  const setTitles = (titleContent: string, messageContent: string) => {
    title.value = titleContent
    message.value = messageContent
  }

  const setType = (typeContent: 'normal' | 'warning' | 'error' | 'success' | 'confirm') => {
    type.value = typeContent
  }

  const hide = () => {
    open.value = false
  }

  return {
    showCancelButton,
    dismissOnAction,
    onConfirm,
    onCancel,
    title,
    message,
    type,
    open,
    confirmText,
    cancelText,
    isProgress,
    neutralText,
    onNeutral,
    showNeutralButton,
    startProgress,
    stopProgress,
    hide,
    createDialog
  }
})
