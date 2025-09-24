export function createFormState<T extends Record<string, any>>(initialData: T) {
	let original = $state<T>({ ...initialData })
	let current = $state<T>({ ...initialData })

	const hasChanges = $derived(JSON.stringify(original) !== JSON.stringify(current))

	return {
		get original() {
			return original
		},
		get current() {
			return current
		},
		get hasChanges() {
			return hasChanges
		},

		reset() {
			current = { ...original }
		},

		setInitial(data: T) {
			original = { ...data }
			current = { ...data }
		},

		update(field: keyof T, value: any) {
			current[field] = value
		}
	}
}
