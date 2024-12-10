export interface OrderResponse {
    success: boolean;
    order: {
        number: string;
    };
    message?: string;
}