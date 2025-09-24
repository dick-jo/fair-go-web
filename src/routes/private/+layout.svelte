<script lang="ts">
	import type { SupabaseClient, User, Session } from '@supabase/supabase-js'
	import type { Database } from '$lib/types/supabase.types'
	import { goto } from '$app/navigation'
	import Button from '$lib/components/Button/Button.svelte'

	interface PrivateLayoutData {
		supabase: SupabaseClient<Database>
		user: User | null
		session: Session | null
		profile: Database['public']['Tables']['profiles']['Row'] | null
		subscriber: Database['public']['Tables']['subscribers']['Row'] | null // Add this line
	}

	let {
		data,
		children
	}: {
		data: PrivateLayoutData
		children: any
	} = $props()

	let { supabase, user, profile } = $derived(data)

	const logout = async () => {
		const { error } = await supabase.auth.signOut()
		if (error) {
			console.error(error)
		} else {
			goto('/')
		}
	}
</script>

<!-- MARKUP--------------------------------------------- -->
<div class="page-clamp">
	<header>
		<div class="title-container">
			<h2 class="title--secondary">YOUR PROFILE</h2>
			<h1 class="title">
				Hello{profile?.first_name ? `, ${profile.first_name}` : user?.email ? `, ${user.email}` : ''}
			</h1>
		</div>

		<div class="action-container">
			<Button label="Sign Out" onclick={logout} />
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
