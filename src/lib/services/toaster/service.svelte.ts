type ToastType = 'neutral' | 'positive' | 'negative'

interface Toast {
	id: number
	title?: string
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

	show(message: string, title?: string, opts: ToastOptions = {}) {
		const id = nextId++
		const type = opts.type ?? 'neutral'
		const duration = opts.duration ?? 8000

		state.toasts = [...state.toasts, { id, message, title, type, duration }]
		setTimeout(() => {
			state.toasts = state.toasts.filter((t) => t.id !== id)
		}, duration)
	},

	clear() {
		state.toasts = []
	}
}
