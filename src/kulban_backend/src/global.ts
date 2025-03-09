export interface Member {
  memberID: string;
  memberAddress: string;
  isActive: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  members: Member[];
  state: number | string;
  isActive?: boolean;
}

export interface Board {
  address: string;
  name: string;
  categories: string[];
  activeTasksNumber: string;
  tasks?: Task[];
  members: Member[];
}

export interface EditCategoryParameters {
  categoryIndex: number;
  newCategoryValue: string;
}
