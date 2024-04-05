import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, Link } from 'react-router-dom';
import { IconButton, Box, Typography, List, ListItem, ListItemText, Paper, Button, Modal, TextField, Alert } from '@mui/material';
import { ArrowBack, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import rootStore from '../../store/RootStore';
import { Patient } from '../../models/PatientModel';
import { Diagnosis } from '../../models/DiagnosisModel';

const DiagnosesPage: React.FC = observer(() => {
    const { patientId } = useParams<{ patientId: string }>();
    const [patientData, setPatientData] = useState<Partial<Patient> | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [newDiagnosis, setNewDiagnosis] = useState('');
    const [newDiagnosisDate, setNewDiagnosisDate] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [editingDiagnosis, setEditingDiagnosis] = useState<Diagnosis | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({
        newDiagnosis: null,
        newDiagnosisDate: null,
        newDescription: null,
    });
    const [loading, setLoading] = useState(false); // Состояние загрузки данных

    useEffect(() => {
        const fetchPatientData = async () => {
            setLoading(true); // Установка loading в true перед началом загрузки
            try {
                if (!patientId) return;
                const response = await fetch(`http://127.0.0.1:8000/patients/${patientId}`, {
                    headers: {
                        'Authorization': `Bearer ${rootStore.authStore.accessToken}`
                    }
                });
                const data = await response.json();
                setPatientData(data);
                const parsedPatientId = parseInt(patientId, 10);
                rootStore.diagnosisStore.setPatientId(parsedPatientId);
            } catch (error) {
                console.error('Error fetching patient data:', error);
            } finally {
                setLoading(false); // Установка loading в false после загрузки данных
            }
        };

        fetchPatientData();
    }, [patientId]);

    useEffect(() => {
        if (patientId && patientData) {
            setLoading(true); // Установка loading в true перед началом загрузки
            rootStore.diagnosisStore.fetchDiagnosesByPatientId(parseInt(patientId))
                .finally(() => setLoading(false)); // Установка loading в false после загрузки данных
        }
    }, [patientId, patientData]);

    const diagnoses: Diagnosis[] = rootStore.diagnosisStore.getDiagnoses();

    const handleDeleteDiagnosis = async (diagnosisId: number) => {
        await rootStore.diagnosisStore.deleteDiagnosis(diagnosisId);
    };

    const handleInputChange = (name: string, value: string) => {
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: null,
        }));
        if (name === 'newDiagnosis') {
            setNewDiagnosis(value);
        } else if (name === 'newDiagnosisDate') {
            setNewDiagnosisDate(value);
        } else if (name === 'newDescription') {
            setNewDescription(value);
        }
    };

    const handleAddDiagnosis = async () => {
        const newErrors: { [key: string]: string | null } = {};

        if (!newDiagnosis.trim()) {
            newErrors.newDiagnosis = 'Поле обязательно для заполнения';
        }

        if (!newDiagnosisDate.trim()) {
            newErrors.newDiagnosisDate = 'Поле обязательно для заполнения';
        } else {
            const datePattern = /^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
            if (!datePattern.test(newDiagnosisDate)) {
                newErrors.newDiagnosisDate = 'Неверный формат даты. Правильный формат: YYYY-MM-DD';
            }
        }

        if (!newDescription.trim()) {
            newErrors.newDescription = 'Поле обязательно для заполнения';
        }

        if (Object.values(newErrors).some(error => error !== null)) {
            setErrors(newErrors);
            return;
        }

        try {
            if (!patientId) throw new Error('Patient ID is undefined');
            await rootStore.diagnosisStore.createDiagnosis(
                parseInt(patientId),
                newDiagnosis.trim(),
                newDiagnosisDate.trim(),
                newDescription.trim()
            );
            setNewDiagnosis('');
            setNewDiagnosisDate('');
            setNewDescription('');
            setShowModal(false);
        } catch (error: any) {
            console.error('Error creating diagnosis:', error);
        }
    };

    const handleEditDiagnosis = (diagnosis: Diagnosis) => {
        setEditingDiagnosis(diagnosis);
        // Устанавливаем значения для редактирования
        setNewDiagnosis(diagnosis.diagnosis);
        setNewDiagnosisDate(diagnosis.diagnosis_date);
        setNewDescription(diagnosis.description);
        setShowModal(true);
    };

    const handleUpdateDiagnosis = async () => {
        try {
            if (!editingDiagnosis) return;

            const newErrors: { [key: string]: string | null } = {};

            if (!newDiagnosis.trim()) {
                newErrors.newDiagnosis = 'Поле обязательно для заполнения';
            }

            if (!newDiagnosisDate.trim()) {
                newErrors.newDiagnosisDate = 'Поле обязательно для заполнения';
            } else {
                const datePattern = /^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
                if (!datePattern.test(newDiagnosisDate)) {
                    newErrors.newDiagnosisDate = 'Неверный формат даты. Правильный формат: YYYY-MM-DD';
                }
            }

            if (!newDescription.trim()) {
                newErrors.newDescription = 'Поле обязательно для заполнения';
            }

            if (Object.values(newErrors).some(error => error !== null)) {
                setErrors(newErrors);
                return;
            }

            const updatedDiagnosis: Diagnosis = {
                ...editingDiagnosis,
                diagnosis: newDiagnosis.trim(),
                diagnosis_date: newDiagnosisDate.trim(),
                description: newDescription.trim(),
                patient_id: patientId ? parseInt(patientId) : 0
            };

            await rootStore.diagnosisStore.updateDiagnosis(updatedDiagnosis);

            setShowModal(false);
            setEditingDiagnosis(null);
        } catch (error: any) {
            console.error('Error updating diagnosis:', error);
        }
    };

    const handleBackButtonClick = () => {
        rootStore.diagnosisStore.setPatientId(null);
    };

    const handleCloseError = () => {
        setErrors({
            newDiagnosis: null,
            newDiagnosisDate: null,
            newDescription: null,
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const formattedDate = `${date.getDate() < 10 ? '0' : ''}${date.getDate()}-${date.getMonth() < 9 ? '0' : ''}${date.getMonth() + 1}-${date.getFullYear()}`;
        return formattedDate;
    };

    return (
        <Box sx={{ padding: '20px', marginBottom: '20px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <Link to="/patients" style={{ textDecoration: 'none' }}>
                    <IconButton onClick={handleBackButtonClick}>
                        <ArrowBack />
                    </IconButton>
                </Link>
                <Typography variant="h4" sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', width: '100%', marginLeft: '10px' }}>Страница диагнозов</Typography>
            </Box>
            {patientData && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' }, // Изменяем направление на столбец для xs (мобильные устройства) и на строку для sm (планшеты и выше)
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: { xs: '20px', sm: 0 }, // Устанавливаем отступ снизу только для мобильных устройств
                        marginRight: 8,
                    }}
                >
                    <Box sx={{ marginLeft: 8, marginBottom: { xs: '20px', sm: 0 } }}> {/* Устанавливаем отступ снизу только для мобильных устройств */}
                        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>Данные пациента:</Typography>
                        <Typography variant="body1">Фамилия: {patientData.last_name}</Typography>
                        <Typography variant="body1">Имя: {patientData.first_name}</Typography>
                        <Typography variant="body1">Отчество: {patientData.patronymic}</Typography>
                        <Typography variant="body1">Пол: {patientData.gender}</Typography>
                        <Typography variant="body1">Дата рождения: {patientData.date_of_birth ? formatDate(patientData.date_of_birth) : 'Не указана'}</Typography>
                    </Box>
                    <Box sx={{ marginBottom: { xs: '20px', sm: 0 } }}> {/* Устанавливаем отступ снизу только для мобильных устройств */}
                        <Button variant="contained" onClick={() => { setEditingDiagnosis(null); setShowModal(true); }}>Добавить диагноз</Button>
                    </Box>
                </Box>
            )}
            {loading ? ( // Отображение индикатора загрузки
                <Typography variant="body1" align="center" sx={{mt: "20px"}}>Загрузка...</Typography>
            ) : (
                diagnoses.length > 0 ? (
                    <List>
                        {diagnoses.map(diagnosis => (
                            <Paper key={diagnosis.id} sx={{ marginTop: 3, width: '90%', marginLeft: 'auto', marginRight: 'auto', padding: 2 }}>
                                <ListItem sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Link to={`/diagnoses/${diagnosis.id}`} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
                                        <ListItemText
                                            primary={<Typography variant="subtitle1">{diagnosis.diagnosis}</Typography>}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography variant="body2">{`Дата: ${formatDate(diagnosis.diagnosis_date)}`}</Typography>
                                                    <Typography variant="body2">{`Описание: ${diagnosis.description}`}</Typography>
                                                </React.Fragment>
                                            }
                                        />
                                    </Link>
                                    <Box>
                                        <IconButton aria-label="edit" onClick={() => handleEditDiagnosis(diagnosis)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton aria-label="delete" onClick={() => handleDeleteDiagnosis(diagnosis.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </ListItem>
                            </Paper>
                        ))}
                    </List>
                ) : (
                    <Alert severity="info" sx={{ mt: 3, width: '90%', marginLeft: 'auto', marginRight: 'auto', marginBottom: 3 }}>Диагнозов нет</Alert>
                )
            )}
            <Modal open={showModal} onClose={() => { setShowModal(false); handleCloseError(); }}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, minWidth: '300px', maxWidth: '80vw' }}>
                    <Typography variant="h5" gutterBottom sx={{ marginBottom: 4 }}>
                        {editingDiagnosis ? 'Редактировать диагноз' : 'Добавить диагноз'}
                    </Typography>
                    <TextField
                        id="new-diagnosis"
                        name="newDiagnosis"
                        label="Диагноз"
                        value={newDiagnosis}
                        onChange={(e) => handleInputChange('newDiagnosis', e.target.value)}
                        error={!!errors.newDiagnosis}
                        helperText={errors.newDiagnosis}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />

                    <TextField
                        id="new-diagnosis-date"
                        name="newDiagnosisDate"
                        label="Дата диагноза"
                        value={newDiagnosisDate}
                        onChange={(e) => handleInputChange('newDiagnosisDate', e.target.value)}
                        error={!!errors.newDiagnosisDate}
                        helperText={errors.newDiagnosisDate}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />

                    <TextField
                        id="new-description"
                        name="newDescription"
                        label="Описание"
                        value={newDescription}
                        onChange={(e) => handleInputChange('newDescription', e.target.value)}
                        error={!!errors.newDescription}
                        helperText={errors.newDescription}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />

                    <Button variant="contained" onClick={editingDiagnosis ? handleUpdateDiagnosis : handleAddDiagnosis} sx={{ mt: 2 }}>{editingDiagnosis ? 'Сохранить' : 'Добавить'}</Button>
                </Box>
            </Modal>
        </Box>
    );
});

export default DiagnosesPage;
