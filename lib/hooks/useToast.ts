// Hook personnalisé pour les toasts avec types
import { toast as hotToast } from 'react-hot-toast'

export const useToast = () => {
  return {
    success: (message: string) => hotToast.success(message),
    error: (message: string) => hotToast.error(message),
    loading: (message: string) => hotToast.loading(message),
    promise: <T,>(
      promise: Promise<T>,
      messages: {
        loading: string
        success: string | ((data: T) => string)
        error: string | ((error: Error) => string)
      }
    ) => hotToast.promise(promise, messages),
  }
}

