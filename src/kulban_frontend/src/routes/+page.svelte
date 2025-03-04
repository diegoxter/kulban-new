<script lang="ts">
	import "../index.scss";
	import { canisterURL } from "$lib/canisters";

	let greeting = "";

	async function onSubmit() {
		const response = await fetch(canisterURL);
		const text = await response.text();

		console.log(text);
	}
</script>

<main>
	<h1>Hello worl!</h1>
	<img src="/logo2.svg" alt="DFINITY logo" />
	<br />
	<br />
	<form action="#" on:submit|preventDefault={onSubmit}>
		<label for="name">Enter your name: &nbsp;</label>
		<input id="name" alt="Name" type="text" />
		<button type="submit">Click Me!</button>
	</form>
	<section id="greeting">{greeting}</section>
</main>
