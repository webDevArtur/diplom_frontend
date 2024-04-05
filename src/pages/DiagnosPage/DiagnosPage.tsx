import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import rootStore from '../../store/RootStore';
import { useParams, Link } from 'react-router-dom';
import { IconButton, Box, Typography, Button, Grid, Card, CardMedia, CardActions, Modal, Input, Stack, CircularProgress } from '@mui/material';
import { ArrowBack, Delete, Add } from "@mui/icons-material";
import ImageSegmentation from '../../components/ImageSegmentation/ImageSegmentation';
import ImageClassification from '../../components/ImageClassification/ImageClassification';

const DiagnosPage: React.FC = observer(() => {
    const { diagnosisId } = useParams<{ diagnosisId: string }>();
    const [images, setImages] = useState<{ image_id: number, image: string, upload_date: string }[]>([]);
    const [patientId, setPatientId] = useState<number | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadDate, setUploadDate] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    const [loading, setLoading] = useState(false); // Добавляем состояние loading для управления индикатором загрузки

    const [selectedImageForClassification, setSelectedImageForClassification] = useState<string | null>(null);
    const [viewImageModalOpen, setViewImageModalOpen] = useState(false); // Добавляем состояние для отображения модального окна просмотра изображения
    const [viewImage, setViewImage] = useState<string | null>(null); // Добавляем состояние для выбранного изображения для просмотра

    useEffect(() => {
        setPatientId(rootStore.diagnosisStore.getPatientId());
    }, []);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                if (!diagnosisId) return;

                setLoading(true); // Устанавливаем loading в true перед отправкой запроса на сервер

                const imagesData = await rootStore.imageStore.getImagesForDiagnosis(diagnosisId);
                setImages(imagesData);
            } catch (error) {
                console.error('Error fetching images:', error);
            } finally {
                setLoading(false); // В любом случае, когда запрос завершен (успешно или с ошибкой), устанавливаем loading в false
            }
        };

        fetchImages();
    }, [diagnosisId]);

    const handleDeleteImage = async (imageId: number) => {
        try {
            await rootStore.imageStore.deleteImage(imageId);
            const updatedImages = images.filter(image => image.image_id !== imageId);
            setImages(updatedImages);
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const handleOpenUploadModal = () => {
        setShowUploadModal(true);
    };

    const handleCloseUploadModal = () => {
        setShowUploadModal(false);
        setSelectedFile(null);
        setUploadDate(null);
        setUploadError('');
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUploadImage = async () => {
        if (selectedFile && diagnosisId && uploadDate) {
            const currentDate = new Date();
            const selectedDate = new Date(uploadDate);
            if (selectedDate > currentDate) {
                setUploadError('Дата загрузки не может быть в будущем');
                return;
            }

            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('upload_date', uploadDate);

            setLoading(true); // Устанавливаем loading в true перед отправкой запроса на сервер

            try {
                await rootStore.imageStore.uploadImage(diagnosisId, formData);
                const imagesData = await rootStore.imageStore.getImagesForDiagnosis(diagnosisId);
                setImages(imagesData);
                handleCloseUploadModal();
            } catch (error) {
                console.error('Error uploading image:', error);
            } finally {
                setLoading(false); // В любом случае, когда запрос завершен (успешно или с ошибкой), устанавливаем loading в false
            }
        }
    };

    const handleImageStatistics = (image: string) => {
        setSelectedImage(prevImage => prevImage === image ? null : image);
    };

    const handleImageClassification = (image: string) => {
        setSelectedImageForClassification(image);
    };

    const handleViewImage = (image: string) => {
        setViewImage(image);
        setViewImageModalOpen(true);
    };

    const handleCloseViewImageModal = () => {
        setViewImage(null);
        setViewImageModalOpen(false);
    };

    return (
        <Box>
            <Typography  variant="h5" sx={{ display: 'flex', justifyContent: 'center', marginTop: 4, marginBottom: 2, fontWeight: 'bold' }}>Страница изображений</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', marginTop: '20px', marginLeft: '20px', marginRight: '20px' }}>
                <Link to={`/patients/${patientId}/diagnoses`}>
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                </Link>
                <IconButton onClick={handleOpenUploadModal}>
                    <Add />
                    <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', width: '100%', marginLeft: '10px', fontSize: '15px' }}>
                        Добавить изображение
                        <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                    </Typography>
                </IconButton>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Grid container spacing={2} sx={{ width: '90%' }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <Typography variant="body1" align="center">Загрузка...</Typography>
                        </Box>
                    ) : (
                        images.map((image, index) => (
                            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                                <Card>
                                    <Typography variant="body2" color="text.secondary" sx={{padding : '10px'}}>
                                        Загружено: {new Date(image.upload_date).toLocaleDateString()}
                                    </Typography>
                                    <CardMedia
                                        component="img"
                                        src={`data:image/jpeg;base64, ${image.image}`}
                                        alt={`Diagnosis Image ${index + 1}`}
                                        onClick={() => handleViewImage(image.image)} // Добавляем обработчик клика для отображения изображения в модальном окне просмотра
                                        style={{ cursor: 'pointer' }} // Добавляем стиль для указания на возможность клика
                                    />
                                    <CardActions sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                                        <Button
                                            size="small"
                                            color="primary"
                                            onClick={() => handleImageStatistics(image.image)}
                                        >
                                            Маска
                                        </Button>
                                        <Button
                                            size="small"
                                            color="primary"
                                            onClick={() => handleImageClassification(image.image)}
                                        >
                                            Диагноз
                                        </Button>
                                        <Button
                                            size="small"
                                            color="secondary"
                                            startIcon={<Delete />}
                                            onClick={() => handleDeleteImage(image.image_id)}
                                        >
                                            Удалить
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Box>
            <Modal
                open={showUploadModal}
                onClose={handleCloseUploadModal}
                aria-labelledby="upload-image-modal"
                aria-describedby="modal-to-upload-an-image"
            >
                <Box
                    sx={{
                        position: 'absolute' as const,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '10px'
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Загрузка изображения
                    </Typography>
                    <Stack spacing={2} sx={{ marginTop: '20px' }}>
                        <Input type="file" onChange={handleImageChange} />
                        <Input type="date" onChange={(event) => setUploadDate(event.target.value)} />
                        {uploadError && <Typography color="error">{uploadError}</Typography>}
                        {/* Отображаем индикатор загрузки в зависимости от состояния loading */}
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <Button variant="contained" onClick={handleUploadImage}>Загрузить</Button>
                        )}
                    </Stack>
                </Box>
            </Modal>
            <Modal
                open={viewImageModalOpen}
                onClose={handleCloseViewImageModal}
                aria-labelledby="view-image-modal"
                aria-describedby="modal-to-view-selected-image"
            >
                <Box
                    sx={{
                        position: 'absolute' as const,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: '10px',
                        outline: 'none', // Убираем обводку вокруг модального окна
                        maxHeight: '90vh', // Устанавливаем максимальную высоту для изображения
                        overflow: 'auto' // Добавляем возможность прокрутки для больших изображений
                    }}
                >
                    {viewImage && <img src={`data:image/jpeg;base64, ${viewImage}`} alt="View" style={{ maxWidth: '100%' }} />} {/* Отображаем выбранное изображение */}
                </Box>
            </Modal>
            <Modal
                open={selectedImage !== null}
                onClose={() => setSelectedImage(null)}
                aria-labelledby="image-segmentation-modal"
                aria-describedby="modal-to-show-image-segmentation"
            >
                <Box>
                    {selectedImage && <ImageSegmentation imageBase64={selectedImage} onClose={() => setSelectedImage(null)} />}
                </Box>
            </Modal>
            <Modal
                open={selectedImageForClassification !== null}
                onClose={() => setSelectedImageForClassification(null)}
                aria-labelledby="image-classification-modal"
                aria-describedby="modal-to-show-image-classification"
            >
                <Box>
                    {selectedImageForClassification && <ImageClassification imageBase64={selectedImageForClassification} onClose={() => setSelectedImageForClassification(null)} />}
                </Box>
            </Modal>
        </Box>
    );
});

export default DiagnosPage;
