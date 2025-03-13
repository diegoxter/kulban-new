<script lang="ts">
	import { canisterURL } from "$lib/canisters";
	import BoardCard from "$lib/components/Boards/BoardCard.svelte";
	import { onMount } from "svelte";
	import { userBoards } from "$lib/shared.svelte";

	onMount(async () => {
		let token = localStorage.getItem("authToken");
		const storedData = localStorage.getItem("boardsData");
		if (storedData && storedData !== "undefined") {
			console.log(storedData);
			const data = JSON.parse(storedData);
			console.log(data);
		}

		try {
			const response = await fetch(`${canisterURL}/get-boards`, {
				method: "GET",
				headers: {
					// prettier-ignore
					"Authorization": `Bearer ${token}`,
				},
			});
			const res = await response.json();
			if (res.error) {
				if (res.message === "Access denied") {
					window.location.href = "/";
				} else {
					throw new Error(res.message);
				}
			}

			localStorage.setItem("boardsData", JSON.stringify(res.boards));
			res.boards.forEach((board: App.Board, index: number) => {
				//if (userBoards.findIndex((userBoard) => userBoard.address !== board.address)) {
				userBoards[index] = board;
				//}
			});
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

			const res = await response.json();

			if (res.error) throw new Error(res.error);

			data.newBoard.members = [];
			data.newBoard.address = res.newAddress;
			userBoards.push(data.newBoard);
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
