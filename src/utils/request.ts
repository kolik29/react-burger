import { checkResponse } from "./checkResponse";

const BASE_URL = 'https://norma.nomoreparties.space';

export function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    return fetch(url, options)
        .then((response) => checkResponse<T>(response));
}