export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  state: number | string;
  isActive?: boolean;
  assigneesIDs: string[];
  assigneesAddys: string[];
}

export interface Board {
  address: string;
  name: string;
  categories: string[];
  activeTasksNumber: string;
  tasks?: Task[];
  members: Array<[string, boolean]>;
}

export interface EditCategoryParameters {
  categoryIndex: number;
  newCategoryValue: string;
}
