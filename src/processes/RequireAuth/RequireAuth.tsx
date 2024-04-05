// RequireAuth.tsx
import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import rootStore from '../../store/RootStore'; // Импорт глобального объекта RootStore

interface RequireAuthProps {
    children: ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = observer(({ children }) => {
    const currentLocation = useLocation();
    const authStore = rootStore.authStore; // Использование экземпляра AuthStore из глобального объекта

    if (!authStore.isLoggedIn  ) { // Проверка авторизации пользователя
        return <Navigate to="/login" state={{ previousLocation: currentLocation }} />;
    }

    return <>{children}</>;
});

export default RequireAuth;