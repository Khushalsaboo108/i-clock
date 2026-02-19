import { toast } from "sonner"

export type ToastOptions = {
    duration?: number
    action?: {
        label: string
        onClick: () => void
    }
}

export const showSuccess = (message: string, options?: ToastOptions) => {
    toast.success(message, {
        duration: options?.duration,
        action: options?.action,
    })
}

export const showError = (message: string, options?: ToastOptions) => {
    toast.error(message, {
        duration: options?.duration,
        action: options?.action,
    })
}

export const showWarning = (message: string, options?: ToastOptions) => {
    toast.warning(message, {
        duration: options?.duration,
        action: options?.action,
    })
}

export const showInfo = (message: string, options?: ToastOptions) => {
    toast.info(message, {
        duration: options?.duration,
        action: options?.action,
    })
}
