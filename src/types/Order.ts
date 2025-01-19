export interface OrderResponse {
    success: boolean;
    order: {
        number: string;
    };
    message?: string;
}

export interface Order {
  _id: string;
  number: number;
  name: string;
  status: 'done' | 'pending' | 'created';
  ingredients: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface OrdersState {
  [key: string]: {
    orders: Order[];
    total: number;
    totalToday: number;
    loading?: boolean;
    error?: string | null;
  };
}