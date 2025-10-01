<script lang="ts">
	import type { SupabaseClient, User, Session } from '@supabase/supabase-js'
	import type { Database, Tables } from '$lib/types/supabase.types'
	import Button from '$lib/components/Button/Button.svelte'
	import { signOut } from '$lib/client/auth'

	interface PrivateLayoutData {
		supabase: SupabaseClient<Database>
		user: User | null
		session: Session | null
		profile: Tables<'profiles'> | null
		subscriber: Tables<'subscribers'> | null
	}

	let { data, children }: { data: PrivateLayoutData; children: any } = $props()

	const handleSignOut = async () => {
		await signOut(data.supabase, { redirect: true })
	}
</script>

<!-- MARKUP--------------------------------------------- -->
<div class="page-clamp">
	<header>
		<div class="title-container">
			<h2 class="title--secondary">YOUR PROFILE</h2>
			<h1 class="title">
				Hello{data.profile?.first_name
					? `, ${data.profile.first_name}`
					: data.user?.email
						? `, ${data.user.email}`
						: ''}
			</h1>
		</div>

		<div class="action-container">
			<Button label="Sign Out" onclick={handleSignOut} />
		</div>
	</header>

	{@render children()}
</div>

<!-- CSS ----------------------------------------------- -->
<style>
	/* CLAMP ------------------------------------------------ */
	.page-clamp {
		--loc-gap: var(--gap-l);
		width: 100%;
		padding: var(--loc-gap) 0;
		max-width: var(--clamp--content-width--s-x);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--loc-gap);

		/* HEADER ----------------------------------------------- */
		header {
			width: 100%;
			display: flex;
			justify-content: space-between;

			.title {
				font: var(--font--heading--l);
			}

			.title--secondary {
				font: var(--font--heading--secondary);
			}
		}
	}
</style>
