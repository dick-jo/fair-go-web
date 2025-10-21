<script lang="ts">
	interface Props {}

	let {}: Props = $props()
</script>

<!-- MARKUP -------------------------------------------- -->
<div class="host brand-delin">
	<div class="line--container">
		<div class="line"></div>
	</div>

	<div class="media-container">
		<img src="/brand/brand-a-text-ev.svg" alt="" />
	</div>

	<div class="line--container">
		<div class="line"></div>
	</div>
</div>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		--loc-height: var(--sp-5);
		--loc-gap: var(--gap-l);
		--loc-clr-border: var(--clr-primary-tr-light);
		width: 100%;
		height: var(--loc-height);
		max-height: var(--loc-height);
		flex: 1;
		display: flex;
		gap: var(--loc-gap);

		/* LINE CONTAINER --------------------------------------- */
		.line--container {
			flex: 1;
			display: flex;
			align-items: center;

			.line {
				flex: 1;
				border-top: var(--bdw) solid var(--loc-clr-border);
			}
		}

		/* MEDIA CONTAINER -------------------------------------- */
		.media-container {
			height: var(--loc-height);

			img {
				height: 100%;
			}
		}
	}
</style>
