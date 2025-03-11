export const token = $state<{ token: string }>({
	token: "",
});

export const userBoards = $state<App.Board[]>([]);
