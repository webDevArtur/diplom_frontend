import { makeAutoObservable } from 'mobx';
import API_BASE_URL from '../config';

class AuthStore {
    isLoggedIn: boolean = false;
    accessToken: string | null = null;
    fullName: string | null = null;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
        this.loadAuthState();
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
                this.fullName = data.full_name; // Сохраняем полученное ФИО
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
                // Обнуляем все поля при успешном выходе
                this.isLoggedIn = false;
                this.accessToken = null;
                this.fullName = null; // Обнуляем ФИО
                this.error = null;

                // Сохраняем состояние авторизации
                this.saveAuthState();
            } else {
                this.isLoggedIn = false;
                this.accessToken = null;
                this.fullName = null; // Обнуляем ФИО
                this.error = typeof data.message === 'string' ? data.message : 'Logout failed';

                // Сохраняем состояние авторизации
                this.saveAuthState();
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
            accessToken: this.accessToken,
            fullName: this.fullName // Сохраняем ФИО в локальное хранилище
        }));
    }

    // Метод для загрузки состояния авторизации из локального хранилища браузера
    private loadAuthState() {
        const authState = localStorage.getItem('authState');
        if (authState) {
            const { isLoggedIn, accessToken, fullName } = JSON.parse(authState);
            this.isLoggedIn = isLoggedIn;
            this.accessToken = accessToken;
            this.fullName = fullName; // Загружаем ФИО из локального хранилища
        }
    }
}

export default AuthStore;
