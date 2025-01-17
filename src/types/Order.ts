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
    createdAt: string;
    name: string;
    status: string;
    ingredients: string[];
    totalPrice: number;
}

export interface OrdersState {
    orders: Order[];
    total: number;
    totalToday: number;
}