import React, { useState, useEffect } from 'react';
import rootStore from '../../store/RootStore';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@mui/material';
import API_BASE_URL from "../../config.ts";

interface ImageSegmentationProps {
    imageBase64: string;
    onClose: () => void;
}

interface Cache {
    [key: string]: string | null;
}

const ImageSegmentation: React.FC<ImageSegmentationProps> = ({ imageBase64, onClose }) => {
    const [segmentedImage, setSegmentedImage] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cache, setCache] = useState<Cache>({});

    const handleSegmentation = async () => {
        setLoading(true);
        setOpenModal(true);
        try {
            if (cache[imageBase64]) {
                setSegmentedImage(cache[imageBase64]);
            } else {
                const byteCharacters = atob(imageBase64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);

                const file = new File([byteArray], 'image.png', { type: 'image/png' });

                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch(API_BASE_URL + '/segmentation/', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${rootStore.authStore.accessToken}`,
                        "accept": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                        "ngrok-skip-browser-warning": "69420"
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to segment image');
                }

                const data = await response.json();
                setSegmentedImage(data.segmented_image);
            }
        } catch (error) {
            console.error('Error segmenting image:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const updateCache = (imageBase64: string, segmentedImage: string) => {
            setCache(prevCache => ({ ...prevCache, [imageBase64]: segmentedImage }));
        };

        if (imageBase64) {
            handleSegmentation().then(() => {
                if (segmentedImage) {
                    updateCache(imageBase64, segmentedImage);
                }
            });
        }
    }, [imageBase64, segmentedImage]);

    return (
        <div>
            <Dialog open={openModal} onClose={onClose}>
                <DialogTitle>Сегментированное изображение</DialogTitle>
                <DialogContent style={{ display: 'flex', justifyContent: 'center' }}>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        segmentedImage && <img src={`data:image/png;base64, ${segmentedImage}`} alt="Segmented Image" width="100%" />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ImageSegmentation;
