type ToastType = 'neutral' | 'positive' | 'negative'

interface Toast {
	id: number
	title?: string
	code?: string
	message: string
	type: ToastType
	duration: number
}

interface ToastOptions {
	type?: ToastType
	duration?: number
}

const state = $state<{ toasts: Toast[] }>({ toasts: [] })
let nextId = 0

export const toaster = {
	get toasts() {
		return state.toasts
	},

	show(title: string, message: string, opts: ToastOptions = {}, code?: string) {
		const id = nextId++
		const type = opts.type ?? 'neutral'
		const duration = opts.duration ?? 8000

		state.toasts = [...state.toasts, { id, title, code, message, type, duration }]
		setTimeout(() => {
			state.toasts = state.toasts.filter((t) => t.id !== id)
		}, duration)
	},

	clear() {
		state.toasts = []
	}
}
