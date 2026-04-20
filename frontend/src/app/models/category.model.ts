export interface CategoryModel {
  id: number;
  name: string;
  icon: string;
  color: string;
  user: number;
  created_at: string;
}

export interface CreateCategoryPayload {
  name: string;
  icon?: string;
  color?: string;
}

