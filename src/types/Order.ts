export interface Order {
  _id: string;
  number: number;
  name: string;
  status: string;
  createdAt: string;
  ingredients: string[];
}

export interface OrdersState {
  orders: Order[];
  total: number;
  totalToday: number;
}
