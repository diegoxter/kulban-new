<script lang="ts">
	let { address, activeTaskNumber, name, members } = $props();
</script>

<a class="board-card" href={`/board/${address}`}>
	<h2>{name}</h2>

	<div>Active tasks: {activeTaskNumber}</div>
	<div>Members: {members.length}</div>
</a>

<style>
	.board-card {
		width: 8rem;
		border: 1px solid grey;
		border-radius: 5px;
		padding: 4px;
		margin: 2rem 1rem;

		h2 {
			font-style: italic;
		}

		&:hover {
			background-color: blue;
			cursor: pointer;
		}
	}
</style>
