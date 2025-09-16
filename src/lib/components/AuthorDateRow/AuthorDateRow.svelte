<script lang="ts">
	interface Props {
		authorName: string;
		authorImageUrl?: string;
		date: string;
	}
	let { authorName, authorImageUrl, date }: Props = $props();
</script>

<!-- MARKUP -------------------------------------------- -->
<div class={['host', 'author-date-row']}>
	<div class="primary">
		<div class="media-container">
			{#if authorImageUrl}
				<img src={authorImageUrl} alt={authorName} />
			{/if}
		</div>
		<span>{authorName}</span>
	</div>
	<div class="secondary">
		<span>{date}</span>
	</div>
</div>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		--loc-height: var(--sp-3);
		--loc-gap: var(--gap-s);
		--loc-clr-ink: var(--clr-ink-tr-heavy-x);
		--loc-clr-ink--light: var(--clr-ink-tr-heavy);
		height: var(--loc-height);
		display: flex;
		justify-content: space-between;

		/* PRIMARY ---------------------------------------------- */
		& > .primary {
			display: flex;
			align-items: center;
			gap: var(--loc-gap);

			.media-container {
				width: var(--loc-height);
				height: var(--loc-height);
				border: var(--bdw) solid var(--clr-dv);
				border-radius: var(--loc-height);
				overflow: hidden;

				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}

			span {
				color: var(--loc-clr-ink);
				font: var(--font--label--secondary--s);
				text-transform: var(--text-case--label);
			}
		}

		/* SECONDARY -------------------------------------------- */
		.secondary {
			display: flex;
			align-items: center;

			span {
				color: var(--loc-clr-ink--light);
				font: var(--font--label--s);
				font-size: var(--fs-1);
				font-weight: 400;
			}
		}
	}
</style>
