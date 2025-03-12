<script lang="ts">
	import { canisterURL } from "$lib/canisters";
	import { userBoards } from "$lib/shared.svelte";
	let { boardIndex, address, name, tasks } = $props();
	let token = localStorage.getItem("authToken");

	async function addTaskClick() {
		try {
			const data: { boardAddress: string; newTasks: App.Task[] } = {
				boardAddress: address,
				newTasks: [
					{
						title: `New task #${tasks.length + 1}`,
						description: "New task description",
						category: name,
						members: [],
						state: 0,
						isActive: true,
					},
				],
			};
			const response = await fetch(`${canisterURL}/create-tasks`, {
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

			data.newTasks.forEach((newTask, index) => {
				newTask.id = res.tasksIDs[index];
				userBoards[boardIndex]?.tasks?.push(newTask);
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function removeTaskclick(id: string | number) {
		try {
			const data = {
				boardAddress: address,
				taskID: id,
			};
			const response = await fetch(`${canisterURL}/delete-task`, {
				method: "DELETE",
				headers: {
					// prettier-ignore
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			userBoards[boardIndex].tasks = userBoards[boardIndex].tasks?.filter((task) => {
				return task.id !== id;
			});

			const res = await response.json();

			if (res.error) throw new Error(res.error);
		} catch (error) {
			console.log(error);
		}
	}
</script>

<div class="category-card">
	<h3>{name}</h3>

	<div class="task-holder">
		{#each tasks as task}
			<div class="task">
				<div class="task-header">
					<h3>{task.title}</h3>
					<button type="button" onclick={() => removeTaskclick(task.id)}> X </button>
				</div>
				<p>{task.description}</p>
			</div>
		{/each}
	</div>

	<button type="button" class="btn-add-task" onclick={() => addTaskClick()}>Add task</button>
</div>

<style>
	.category-card {
		display: flex;
		flex-direction: column;
		width: 15rem;
		height: 25rem;
		margin: 1.5rem;
		padding: 1rem;
		border: 1px solid black;
		border-radius: 5px;
	}

	.task-holder {
		height: 75%;
		margin: 8px 0;
		padding: 10px 12px;
		border: 1px solid black;
		border-radius: 5px;
	}

	.task {
		margin: 8px 0;
		padding: 4px 8px;
		border: 1px solid black;
		border-radius: 5px;
		&:hover {
			background-color: gold;
		}
	}

	.task-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		button {
			padding: 1px 6px;
			border-radius: 5px;
			background-color: #ffffff;

			&:hover {
				background-color: #b41b1b;
			}
		}
	}

	.btn-add-task {
		background-color: #bbedd1;
		border-radius: 5px;
		padding: 0.5rem;

		&:hover {
			background-color: #3dcd7c;
		}
	}
</style>
