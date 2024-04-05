import { makeAutoObservable } from 'mobx';
import API_BASE_URL from "../config.ts";

class ImageStore {
    constructor() {
        makeAutoObservable(this);
    }

    async getImagesForDiagnosis(diagnosisId: string): Promise<{ image_id: number, image: string, upload_date: string }[]> {
        try {
            const response = await fetch(API_BASE_URL + `/diagnoses/${diagnosisId}/images/`, {
                headers: {
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                    "ngrok-skip-browser-warning": "69420"
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting images:', error);
            throw error;
        }
    }

    async deleteImage(imageId: number): Promise<void> {
        try {
            const response = await fetch(API_BASE_URL + `/images/${imageId}/`, {
                method: 'DELETE',
                headers: {
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                    "ngrok-skip-browser-warning": "69420"
                }
            });
            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage.detail);
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
    }

    async uploadImage(diagnosisId: string, imageData: FormData): Promise<{ image_id: number }> {
        try {
            const response = await fetch(API_BASE_URL + `/diagnoses/${diagnosisId}/images/`, {
                method: 'POST',
                headers: {
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                    "ngrok-skip-browser-warning": "69420"
                },
                body: imageData
            });
            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage.detail);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }
}

export default ImageStore;
