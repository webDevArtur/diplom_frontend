import React, { useState, useEffect } from 'react';
import rootStore from '../../store/RootStore';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Typography } from '@mui/material';
import API_BASE_URL from "../../config.ts";

interface ImageClassificationProps {
    imageBase64: string;
    onClose: () => void;
}

const ImageClassification: React.FC<ImageClassificationProps> = ({ imageBase64, onClose }) => {
    const [classificationResult, setClassificationResult] = useState<string | null>(null);
    const [probabilitiesGraph, setProbabilitiesGraph] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const classifyImage = async () => {
            setLoading(true);
            try {
                const formData = new FormData();
                const byteCharacters = atob(imageBase64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const file = new File([byteArray], 'image.jpg', { type: 'image/jpeg' });
                formData.append('file', file);

                const response = await fetch(API_BASE_URL + '/classify_diagnosis/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${rootStore.authStore.accessToken}`,
                        "accept": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                        "ngrok-skip-browser-warning": "69420"
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to classify image');
                }

                const data = await response.json();
                setClassificationResult(data.diagnosis);
                setProbabilitiesGraph(data.probabilities_graph);
            } catch (error) {
                console.error('Error classifying image:', error);
            } finally {
                setLoading(false);
            }
        };

        classifyImage();
    }, [imageBase64]);

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>Результат классификации</DialogTitle>
            <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <div style={{ marginBottom: '20px', width: '100%', display: 'flex', justifyContent: 'start' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Диагноз: {classificationResult}</Typography>
                        </div>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            {probabilitiesGraph && <img src={`data:image/png;base64, ${probabilitiesGraph}`} alt="Probabilities Graph" style={{ maxWidth: '100%', height: 'auto' }} />}
                        </div>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Закрыть</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ImageClassification;
