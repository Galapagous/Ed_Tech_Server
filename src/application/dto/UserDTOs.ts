export interface CreateUserDTO {
  email: string;
  username: string;
  password: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  email: string;
  username: string;
}

export interface UserResponseDTO {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  token?: string;
}

export interface PaginatedUserDTO {
  users: UserResponseDTO[];
  limit: number;
  page: number;
  total: number;
}
