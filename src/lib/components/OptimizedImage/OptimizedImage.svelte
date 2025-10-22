<script lang="ts">
	import { getOptimizedMediaUrl } from '$lib/utils/media'
	import { onMount } from 'svelte'

	interface Props {
		src: string // Path in Supabase storage (e.g., 'news/article-1.jpg')
		alt: string
		aspectRatio?: number // e.g., 16/9, 4/3, 1 - if not provided, inherits from parent
		sizes?: string // Responsive sizes hint for browser
		quality?: number // 1-100, default 80
		loading?: 'lazy' | 'eager'
		class?: string
	}

	let {
		src,
		alt,
		aspectRatio,
		sizes = '100vw',
		quality = 80,
		loading = 'lazy',
		class: className = ''
	}: Props = $props()

	let imgElement: HTMLImageElement | undefined = $state()
	let isLoaded = $state(false)
	let isInView = $state(false)

	// Generate srcset for different screen sizes
	const widths = [400, 800, 1200, 1600]
	const srcset = widths.map((w) => `${getOptimizedMediaUrl(src, { width: w, quality })} ${w}w`).join(', ')

	// Default src (use medium size as fallback)
	const defaultSrc = getOptimizedMediaUrl(src, { width: 800, quality })

	// Tiny placeholder for blur effect (super low quality, small size)
	const placeholderSrc = getOptimizedMediaUrl(src, { width: 40, quality: 20 })

	onMount(() => {
		if (!imgElement) return

		// Intersection observer to detect when image enters viewport
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						isInView = true
						observer.disconnect()
					}
				})
			},
			{ rootMargin: '50px' } // Start loading slightly before entering viewport
		)

		observer.observe(imgElement)

		return () => observer.disconnect()
	})

	function handleLoad() {
		isLoaded = true
	}
</script>

<!-- HTML ----------------------------------------------- -->
<div class={['optimized-image-container', className]} style:aspect-ratio={aspectRatio}>
	<!-- Blurred placeholder (loads immediately, tiny file) -->
	{#if !isLoaded}
		<img src={placeholderSrc} alt="" class="placeholder" aria-hidden="true" />
	{/if}

	<!-- Full quality image (loads when in view) -->
	<img
		bind:this={imgElement}
		src={defaultSrc}
		srcset={isInView ? srcset : undefined}
		{sizes}
		{alt}
		{loading}
		class="main-image"
		class:loaded={isLoaded}
		onload={handleLoad}
	/>
</div>

<!-- CSS ----------------------------------------------- -->
<style>
	.optimized-image-container {
		position: relative;
		width: 100%;
		height: 100%;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		/* PLACEHOLDER (blurred tiny image) */
		.placeholder {
			position: absolute;
			inset: 0;
			filter: blur(20px);
			transform: scale(1.1); /* Scale up slightly to hide blur edges */
			opacity: 1;
			transition: opacity 0.3s ease-out;
		}

		/* MAIN IMAGE */
		.main-image {
			position: relative;
			opacity: 0;
			transition: opacity 0.6s ease-out;

			&.loaded {
				opacity: 1;
			}
		}
	}
</style>
