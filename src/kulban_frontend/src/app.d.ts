// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Token {
			token: string;
			error?: string;
		}

		interface Member {
			memberID: string;
			memberAddress: string;
			isActive: boolean;
		}

		interface Board {
			address?: string;
			name: string;
			categories: string[];
			activeTasksNumber?: string;
			tasks?: Task[];
			members?: Member[];
		}

		interface NewBoard {
			newBoard: {
				name: string;
				categories: string[];
				members?: Member[];
			};
		}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
