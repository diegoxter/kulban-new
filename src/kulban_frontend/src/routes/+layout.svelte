<script lang="ts">
	import "../app.css";
	import { token } from "$lib/shared.svelte";
	let { children } = $props();

	let onLocation = $state<boolean>(false);

	$effect(() => {
		let localToken: string | null = localStorage.getItem("authToken");
		//$inspect(token);
		if (localToken !== null && !onLocation) {
			token.token = localToken;
			onLocation = true;
		}
	});
</script>

{@render children()}
