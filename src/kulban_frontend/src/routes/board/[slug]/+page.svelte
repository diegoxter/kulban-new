<script lang="ts">
	import { onMount } from "svelte";
	import { canisterURL } from "$lib/canisters";
	import { userBoards } from "$lib/shared.svelte";
	import CategoryCard from "$lib/components/Boards/CategoryCard.svelte";

	const boardAddress = window?.location.pathname.split("/board/")[1];
	const storedBoardIndex = userBoards.findIndex((board) => board.address === boardAddress);
	let tasks = $derived(userBoards[storedBoardIndex].tasks);

	onMount(async () => {
		let token = localStorage.getItem("authToken");

		try {
			const response = await fetch(`${canisterURL}/get-board/${boardAddress}`, {
				method: "GET",
				headers: {
					// prettier-ignore
					"Authorization": `Bearer ${token}`,
				},
			});

			const res = await response.json();

			if (res.error) throw new Error(res.error);

			userBoards[storedBoardIndex] = res;
		} catch (error) {
			console.log(error);
		}
	});

	async function addCategoryClick() {
		let token = localStorage.getItem("authToken");
		try {
			const data = {
				boardAddress: boardAddress,
				newCategory: `New category #${userBoards[storedBoardIndex].categories.length}`,
			};
			const response = await fetch(`${canisterURL}/create-category`, {
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

			userBoards[storedBoardIndex].categories.push(data.newCategory);
		} catch (error) {
			console.log(error);
		}
	}
</script>

<div style="display: flex; flex-direction: row; justify-content: space-between;">
	<h1>{userBoards[storedBoardIndex].name}</h1>

	<button type="button" class="btn-add-category" onclick={addCategoryClick}> Add category </button>
</div>

<div class="category-card-holder">
	{#if typeof tasks !== "undefined"}
		{#each Object.values(userBoards[storedBoardIndex].categories) as categoryName}
			<CategoryCard
				address={boardAddress}
				boardIndex={storedBoardIndex}
				name={categoryName}
				tasks={tasks.filter((task) => task.category === categoryName)}
			/>
		{/each}
	{/if}
</div>

<style>
	.category-card-holder {
		display: flex;
		flex-direction: row;
	}

	.btn-add-category {
		border: 1px solid #213cb8;
		background-color: #7186e4;
		color: #b6b6b6;

		border-radius: 5px;
		padding: 5px;

		&:hover {
			background-color: #213cb8;
			color: white;
		}
	}
</style>
