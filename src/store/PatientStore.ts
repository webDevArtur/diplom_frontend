import { makeAutoObservable } from 'mobx';
import { Patient } from '../models/PatientModel';
import AuthStore from './AuthStore';
import API_BASE_URL from "../config.ts";

class PatientStore {
    patients: Patient[] = [];
    authStore: AuthStore;

    constructor(authStore: AuthStore) {
        this.authStore = authStore;
        makeAutoObservable(this);
    }

    async fetchPatients() {
        try {
            const response = await fetch(API_BASE_URL + '/patients', {
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
            this.patients = data;
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    }

    async createPatient(newPatientData: Omit<Patient, 'id'>) {
        try {
            const response = await fetch(API_BASE_URL + '/patients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authStore.accessToken}`,
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                    "ngrok-skip-browser-warning": "69420"
                },
                body: JSON.stringify(newPatientData)
            });
            const newPatient = await response.json();
            this.patients.push(newPatient);
        } catch (error) {
            console.error('Error creating patient:', error);
        }
    }

    async deletePatient(patientId: number) {
        try {
            await fetch(API_BASE_URL + `/patients/${patientId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.authStore.accessToken}`,
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                    "ngrok-skip-browser-warning": "69420"
                }
            });
            // Удаление пациента из массива после успешного удаления на сервере
            this.patients = this.patients.filter(patient => patient.id !== patientId);
        } catch (error) {
            console.error('Error deleting patient:', error);
        }
    }

    async updatePatient(updatedPatientData: Patient) {
        try {
            await fetch(API_BASE_URL + `/patients/${updatedPatientData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authStore.accessToken}`,
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                    "ngrok-skip-browser-warning": "69420"
                },
                body: JSON.stringify(updatedPatientData)
            });
            // Обновление пациента в массиве после успешного обновления на сервере
            const index = this.patients.findIndex(patient => patient.id === updatedPatientData.id);
            if (index !== -1) {
                this.patients[index] = updatedPatientData;
            }
        } catch (error) {
            console.error('Error updating patient:', error);
        }
    }

    async fetchPatientById(patientId: number) {
        try {
            const response = await fetch(API_BASE_URL + `/patients/${patientId}`, {
                headers: {
                    'Authorization': `Bearer ${this.authStore.accessToken}`,
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                    "ngrok-skip-browser-warning": "69420"
                }
            });
            const patient = await response.json();
            if (response.ok) {
                this.patients.push(patient);
            } else {
                console.error('Error fetching patient:', patient);
            }
        } catch (error) {
            console.error('Error fetching patient:', error);
        }
    }

    getPatients(): Patient[] {
        return this.patients;
    }
}

export default PatientStore;
