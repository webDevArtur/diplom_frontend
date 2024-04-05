import { makeAutoObservable } from 'mobx';
import { Diagnosis } from '../models/DiagnosisModel';
import AuthStore from './AuthStore';
import API_BASE_URL from '../config';

class DiagnosisStore {
    diagnoses: Diagnosis[] = [];
    authStore: AuthStore;
    private _patientId: number | null = null;
    error: string | null = null; // Добавляем поле для хранения ошибки

    constructor(authStore: AuthStore) {
        this.authStore = authStore;
        makeAutoObservable(this);
    }

    async fetchDiagnosesByPatientId(patientId: number) {
        try {
            const response = await fetch(API_BASE_URL + `/patients/${patientId}/diagnoses/`, {
                headers: {
                    'Authorization': `Bearer ${this.authStore.accessToken}`,
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                    "ngrok-skip-browser-warning": "69420"
                }
            });
            const data = await response.json();
            this.diagnoses = data;
        } catch (error) {
            console.error('Error fetching diagnoses:', error);
        }
    }

    async deleteDiagnosis(diagnosisId: number) {
        try {
            await fetch(API_BASE_URL + `/diagnoses/${diagnosisId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.authStore.accessToken}`
                }
            });
            // Удаление диагноза из массива после успешного удаления на сервере
            this.diagnoses = this.diagnoses.filter(diagnosis => diagnosis.id !== diagnosisId);
        } catch (error) {
            console.error('Error deleting diagnosis:', error);
        }
    }

    async createDiagnosis(patientId: number, diagnosis: string, diagnosisDate: string, description: string) {
        try {
            // Валидация данных перед отправкой запроса
            if (!patientId || !diagnosis || !diagnosisDate || !description) {
                throw new Error('Не все данные заполнены');
            }

            const response = await fetch(API_BASE_URL + `/patients/${patientId}/diagnoses/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.authStore.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    patient_id: patientId,
                    diagnosis: diagnosis,
                    diagnosis_date: diagnosisDate,
                    description: description
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка при создании диагноза');
            }

            const newDiagnosis = await response.json();
            this.diagnoses.push(newDiagnosis);
        } catch (error: any) { // Явное приведение к типу 'any'
            this.error = error.message; // Сохраняем сообщение об ошибке
            console.error('Error creating diagnosis:', error);
        }
    }

    async updateDiagnosis(updatedDiagnosis: Diagnosis) {
        try {
            // Валидация данных перед отправкой запроса
            if (!updatedDiagnosis.patient_id || !updatedDiagnosis.diagnosis || !updatedDiagnosis.diagnosis_date || !updatedDiagnosis.description) {
                throw new Error('Не все данные заполнены');
            }

            const response = await fetch(API_BASE_URL + `/diagnoses/${updatedDiagnosis.id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.authStore.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    patient_id: updatedDiagnosis.patient_id, // Включаем patient_id в объект
                    diagnosis: updatedDiagnosis.diagnosis,
                    diagnosis_date: updatedDiagnosis.diagnosis_date,
                    description: updatedDiagnosis.description
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка при обновлении диагноза');
            }

            // Обновляем диагноз в массиве после успешного обновления на сервере
            const index = this.diagnoses.findIndex(diagnosis => diagnosis.id === updatedDiagnosis.id);
            if (index !== -1) {
                this.diagnoses[index] = updatedDiagnosis;
            }
        } catch (error: any) {
            this.error = error.message; // Сохраняем сообщение об ошибке
            console.error('Error updating diagnosis:', error);
        }
    }



    setPatientId(id: number | null) {
        this._patientId = id;
    }

    getPatientId(): number | null {
        return this._patientId;
    }

    getDiagnoses(): Diagnosis[] {
        return this.diagnoses;
    }

    clearError() {
        this.error = null; // Очищаем ошибку
    }
}

export default DiagnosisStore;
