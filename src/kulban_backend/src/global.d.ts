export {};

declare global {
  interface Task {
    id: string;
    title: string;
    description: string;
    category: string;
    state: number | string;
  }

  interface Board {
    address: string;
    name: string;
    categories: string[];
    activeTasksNumber: string;
    tasks?: Task[];
    members: Array<[string, boolean]>;
  }
}
