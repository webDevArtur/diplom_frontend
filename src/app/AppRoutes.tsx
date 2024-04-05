// AppRoutes.tsx
import type { FC } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import RequireAuth from '../processes/RequireAuth/RequireAuth';
import LoginPage from '../pages/LoginPage/LoginPage';
import Page404 from '../pages/Page404/Page404';
import { ColumnLayout } from '../shared/layouts/ColumnLayout';
import PatientsPage from "../pages/PatientsPage/PatientsPage.tsx";
import DiagnosesPage from "../pages/DiagnosesPage/DiagnosesPage.tsx";
import DiagnosPage from "../pages/DiagnosPage/DiagnosPage.tsx";

const AppRoutes: FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/"
                element={
                    <RequireAuth>
                        <ColumnLayout>
                            <Outlet />
                        </ColumnLayout>
                    </RequireAuth>
                }
            >
                <Route index element={<PatientsPage />} />
                <Route path="patients" element={<PatientsPage />} />
                <Route path="patients/:patientId/diagnoses" element={<DiagnosesPage />} /> // Добавляем новый маршрут для страницы диагнозов пациента
                <Route path="diagnoses/:diagnosisId" element={<DiagnosPage />} /> // Добавляем маршрут для страницы диагноза

                <Route path="*" element={<Page404 />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
