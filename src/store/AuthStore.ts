import { makeAutoObservable } from 'mobx';
import API_BASE_URL from '../config';

class AuthStore {
    isLoggedIn: boolean = false;
    accessToken: string | null = null;
    error: string | null = null; // Указываем тип string для переменной error

    constructor() {
        makeAutoObservable(this);
        this.loadAuthState(); // Загружаем состояние авторизации при инициализации
    }

    async login(username: string, password: string): Promise<void> {
        try {
            const response = await fetch(API_BASE_URL + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                    "ngrok-skip-browser-warning": "69420"
                },
                body: new URLSearchParams({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.isLoggedIn = true;
                this.accessToken = data.access_token;
                this.error = null; // Обнуляем ошибку при успешном входе

                // Сохраняем состояние авторизации
                this.saveAuthState();
            } else {
                // Устанавливаем сообщение об ошибке в случае неудачного входа
                this.error = typeof data.message === 'string' ? data.message : 'Ошибка авторизации';
            }
        } catch (error) {
            // Обработка ошибки
            this.error = error instanceof Error ? error.message : 'Ошибка авторизации';
        }
    }

    async logout(): Promise<void> {
        try {
            const response = await fetch(API_BASE_URL + '/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                    "ngrok-skip-browser-warning": "69420"
                }
            });

            const data = await response.json();

            if (response.ok) {
                this.isLoggedIn = false;
                this.accessToken = null;

                this.saveAuthState();
            } else {
                this.isLoggedIn = false;
                this.accessToken = null;

                this.saveAuthState();
                // Устанавливаем сообщение об ошибке в случае неудачного выхода
                this.error = typeof data.message === 'string' ? data.message : 'Logout failed';
            }
        } catch (error) {
            // Обработка ошибки
            this.error = error instanceof Error ? error.message : 'Logout failed';
        }
    }

    // Метод для сохранения состояния авторизации в локальном хранилище браузера
    private saveAuthState() {
        localStorage.setItem('authState', JSON.stringify({
            isLoggedIn: this.isLoggedIn,
            accessToken: this.accessToken
        }));
    }

    // Метод для загрузки состояния авторизации из локального хранилища браузера
    private loadAuthState() {
        const authState = localStorage.getItem('authState');
        if (authState) {
            const { isLoggedIn, accessToken } = JSON.parse(authState);
            this.isLoggedIn = isLoggedIn;
            this.accessToken = accessToken;
        }
    }
}

export default AuthStore;
