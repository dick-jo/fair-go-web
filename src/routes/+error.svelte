<script lang="ts">
	import { page } from '$app/state'
</script>

<!-- MARKUP -------------------------------------------- -->
<div class="host">
	<h1>Something went wrong...</h1>

	<!-- {#if page.status === 404} -->
	<!-- 	<p>The page you're looking for doesn't exist.</p> -->
	<!-- {:else if page.status >= 500} -->
	<!-- 	<p>We're experiencing technical difficulties. Please try again later.</p> -->
	<!-- {:else} -->
	<!-- 	<p>An unexpected error occurred.</p> -->
	<!-- {/if} -->

	{#if page.error?.message}
		<p class="details">"{page.error.message}"</p>
	{/if}
</div>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		padding: var(--gap-max) 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gap-l);

		p {
			&.details {
				font: var(--font--body--l);
			}
		}
	}
</style>
