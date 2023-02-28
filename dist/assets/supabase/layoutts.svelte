<script lang="ts">
	import { db } from "$lib/db/client";
	import { invalidate } from "$app/navigation";
	import { onMount } from "svelte";

	onMount(() => {
		const {
			data: { subscription },
		} = db.auth.onAuthStateChange(() => {
			invalidate("supabase:auth");
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<slot />
