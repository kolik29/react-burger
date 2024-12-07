import { checkResponse } from "./checkResponse";

const baseUrl = 'https://norma.nomoreparties.space';

export function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${baseUrl}${endpoint}`;
    
    return fetch(url, options)
        .then((response) => checkResponse<T>(response));
}