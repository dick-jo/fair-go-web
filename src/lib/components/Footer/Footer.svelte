<script lang="ts">
	interface Props {}

	let {}: Props = $props();
</script>

<!-- MARKUP -------------------------------------------- -->
<div id="footer" class="host footer">
	<div class="clamp"></div>
</div>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		width: 100%;
		border-top: var(--bdw) solid var(--clr-dv);

		/* CLAMP ------------------------------------------------ */
		.clamp {
			width: 100%;
			max-width: var(--clamp--content-width--max);
		}
	}
</style>
