export async function checkResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} - ${response.statusText}`);
    }
    return response.json() as Promise<T>;
}