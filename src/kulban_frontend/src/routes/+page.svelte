<script lang="ts">
	import "../index.scss";
	import { canisterURL } from "$lib/canisters";
	import { token } from "$lib/shared.svelte";

	let endpoint = $state<string>("register");
	let email = $state<string>("");
	let password = $state<string>("");
	let error = $state<string>("");

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault();

		const data = {
			email,
			password,
		};

		try {
			const response = await fetch(`${canisterURL}/${endpoint}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			const res: App.Token = await response.json();

			if (!res.token) {
				error = res.error as string;
				throw new Error("failed to authenticate");
			}

			token.token = res.token;
			localStorage.setItem("authToken", res.token);
			window.location.href = "/user";
		} catch (error) {
			console.log(error);
		}
	}
</script>

<main>
	<h1 class="text-center">Kulban!</h1>
	<br />
	<br />
	<h1 class="text-center">{endpoint.toUpperCase()}</h1>
	<br />
	<div class="flex justify-center">
		<button
			class={`btn-${endpoint === "register" ? "active" : "inactive"}`}
			type="button"
			onclick={() => (endpoint = "register")}>Register</button
		>
		<button
			class={`btn-${endpoint === "login" ? "active" : "inactive"}`}
			type="button"
			onclick={() => (endpoint = "login")}>Login</button
		>
	</div>
	<form action="#" onsubmit={(e) => onSubmit(e as SubmitEvent)}>
		<label for="email">Enter your email &nbsp;</label>
		<input bind:value={email} id="email" alt="Email" type="email" />
		<label for="password">Enter password &nbsp;</label>
		<input bind:value={password} id="password" alt="Password" type="password" />
		<button type="submit">Click Me!</button>
	</form>

	{#if error !== ""}
		<span style="color: red; border: 1px solid black; margin: 0 auto;"> {error}</span>
	{/if}
</main>

<style lang="postcss">
	@reference "tailwindcss";
	:global(html) {
		background-color: theme(--color-gray-100);
	}

	.btn-active {
		border: 1px solid black;
		background-color: blueviolet;
	}

	.btn-inactive {
		border: 1px solid grey;
		background-color: grey;
	}
</style>
