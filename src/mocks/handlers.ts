import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('https://norma.nomoreparties.space/api/auth/register', async ({ request }) => {
    const { email, name } = await request.json() as { email: string; name: string };
    
    return HttpResponse.json({
      user: { id: '12345', email, name },
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-123',
    }, {
      status: 201
    });
  }),
  
  http.post('https://norma.nomoreparties.space/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as { email: string; password: string };;
    
    if (email === 'user@example.com' && password === 'password123') {
      return HttpResponse.json(
        {
          user: { id: '12345', email },
          accessToken: 'access-token-123',
          refreshToken: 'refresh-token-123',
        },
        { status: 200 }
      );
    }
    
    return HttpResponse.json(
      { message: 'Неверные учетные данные.' },
      { status: 401 }
    );
  }),
  
  http.post('https://norma.nomoreparties.space/api/auth/logout', async ({ request }) => {
    const { token } = await request.json() as { token: string };
    
    if (token === 'refresh-token-123') {
      return HttpResponse.json(
        { message: 'Успешный выход.' },
        { status: 200 }
      );
    }
    
    return HttpResponse.json(
      { message: 'Неверный токен.' },
      { status: 400 }
    );
  }),
  
  http.post('https://norma.nomoreparties.space/api/auth/token', async ({ request }) => {
    const { refreshToken } = await request.json() as { refreshToken: string };
    
    if (refreshToken === 'refresh-token-123') {
      return HttpResponse.json(
        {
          accessToken: 'new-access-token-456',
          refreshToken: 'new-refresh-token-456',
        },
        { status: 200 }
      );
    }
    
    return HttpResponse.json(
      { message: 'Неверный refreshToken.' },
      { status: 401 }
    );
  }),
  
  http.get('https://norma.nomoreparties.space/api/auth/user', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (authHeader === 'access-token-123' || authHeader === 'new-access-token-456') {
      return HttpResponse.json(
        {
          id: '12345',
          email: 'user@example.com',
          name: 'Test User',
        },
        { status: 200 }
      );
    }
    
    return HttpResponse.json(
      { message: 'Неверный accessToken.' },
      { status: 401 }
    );
  }),
  
  http.patch('https://norma.nomoreparties.space/api/auth/user', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const { name, email } = await request.json() as { name: string; email: string };
    
    if (authHeader === 'access-token-123' || authHeader === 'new-access-token-456') {
      return HttpResponse.json(
        {
          id: '12345',
          email,
          name,
        },
        { status: 200 }
      );
    }
    
    return HttpResponse.json(
      { message: 'Неверный accessToken.' },
      { status: 401 }
    );
  }),
  
  http.get('https://norma.nomoreparties.space/api/ingredients', () => {
    return HttpResponse.json(
      {
        data: [
          {
            _id: "643d69a5c3f7b9001cfa093c",
            name: "Краторная булка N-200i",
            type: "bun",
            proteins: 80,
            fat: 24,
            carbohydrates: 53,
            calories: 420,
            price: 1255,
            image: "https://code.s3.yandex.net/react/code/bun-02.png",
            image_mobile: "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
            image_large: "https://code.s3.yandex.net/react/code/bun-02-large.png",
            __v: 0
          },
          {
            _id: "643d69a5c3f7b9001cfa0941",
            name: "Биокотлета из марсианской Магнолии",
            type: "main",
            proteins: 420,
            fat: 142,
            carbohydrates: 242,
            calories: 4242,
            price: 424,
            image: "https://code.s3.yandex.net/react/code/meat-01.png",
            image_mobile: "https://code.s3.yandex.net/react/code/meat-01-mobile.png",
            image_large: "https://code.s3.yandex.net/react/code/meat-01-large.png",
            __v: 0
          },
          {
            _id: "643d69a5c3f7b9001cfa093e",
            name: "Филе Люминесцентного тетраодонтимформа",
            type: "main",
            proteins: 44,
            fat: 26,
            carbohydrates: 85,
            calories: 643,
            price: 988,
            image: "https://code.s3.yandex.net/react/code/meat-03.png",
            image_mobile: "https://code.s3.yandex.net/react/code/meat-03-mobile.png",
            image_large: "https://code.s3.yandex.net/react/code/meat-03-large.png",
            __v: 0
          }
        ],
        success: true,
      },
      { status: 200 }
    );
  }),
  
  http.post('https://norma.nomoreparties.space/api/orders', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (authHeader === 'access-token-123') {
      return HttpResponse.json({
        success: true,
        order: { number: '987654' },
      }, { status: 200 });
    }
    
    return HttpResponse.json({
      message: 'Unauthorized',
    }, { status: 401 });
  }),
];
