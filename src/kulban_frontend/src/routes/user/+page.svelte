<script lang="ts">
	import { canisterURL } from "$lib/canisters";
	import BoardCard from "$lib/components/Boards/BoardCard.svelte";
	import { onMount } from "svelte";
	import { userBoards } from "$lib/shared.svelte";

	onMount(async () => {
		let token = localStorage.getItem("authToken");

		try {
			const response = await fetch(`${canisterURL}/get-boards`, {
				method: "GET",
				headers: {
					// prettier-ignore
					"Authorization": `Bearer ${token}`,
				},
			});
			const res = await response.json();
			res.boards.forEach((board: App.Board) => {
				userBoards.push(board);
			});

			console.log(res);
		} catch (error) {
			console.log(error);
		}
	});

	async function createBoardclick() {
		let token = localStorage.getItem("authToken");
		try {
			const data: { newBoard: App.Board } = {
				newBoard: {
					name: `Board #${userBoards.length + 1}`,
					categories: ["To Do", "In Progress", "Done"],
				},
			};

			const response = await fetch(`${canisterURL}/create-board`, {
				method: "POST",
				headers: {
					// prettier-ignore
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			data.newBoard.members = [];
			console.log(data.newBoard);
			userBoards.push(data.newBoard);
			const res = await response.json();
			console.log(res);
		} catch (error) {
			console.log(error);
		}
	}
</script>

<h1>User page</h1>

<h3>Boards: {userBoards.length}</h3>

<button
	style="background-color: green; border-radius: 5px; padding: 4px;"
	onclick={() => createBoardclick()}>Create board</button
>

<div class="board-cards-container">
	{#each userBoards as board}
		<BoardCard
			address={board.address}
			activeTaskNumber={board.activeTasksNumber}
			name={board.name}
			members={board.members}
		/>
	{/each}
</div>

<style>
	.board-cards-container {
		display: flex;
		flex-direction: row;
	}
</style>
