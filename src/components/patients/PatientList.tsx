import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Typography, List, ListItem, ListItemText, IconButton, Paper, Box, Alert, TextField } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import rootStore from '../../store/RootStore';
import { Link } from 'react-router-dom';
import UpdatePatientForm from './UpdatePatientForm';
import { Patient } from '../../models/PatientModel';

const PatientList: React.FC = observer(() => {
    const patientStore = rootStore.patientStore;
    const [isEdit, setIsEdit] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        const fetchPatients = async () => {
            await patientStore.fetchPatients();
            setLoading(false);
        };

        fetchPatients();
    }, [patientStore]);

    const patients = patientStore.getPatients();

    const handleDelete = async (patientId: number) => {
        await patientStore.deletePatient(patientId);
    };

    const handleUpdate = async (updatedPatient: Patient) => {
        await patientStore.updatePatient(updatedPatient);
        setIsEdit(null);
    };

    const handleCloseForm = () => {
        setIsEdit(null); // Закрываем форму редактирования
    };

    // Функция для фильтрации пациентов по поисковому запросу
    const filteredPatients = patients.filter(patient =>
        `${patient.last_name} ${patient.first_name} ${patient.patronymic ? patient.patronymic : ''}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box mt={4}>
            <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <TextField
                    label="Поиск пациентов"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ marginBottom: 2, width: '50%'}}
                />
            </Box>
            {loading ? (
                <Typography variant="body1" align="center">Загрузка...</Typography>
            ) : (
                filteredPatients.length > 0 ? (
                    <List>
                        {filteredPatients.map(patient => (
                            <Paper key={patient.id} sx={{ marginTop: 3, width: '90%', marginLeft: 'auto', marginRight: 'auto', padding: 2, boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)' }}>
                                <ListItem sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                    {isEdit === patient.id ? (
                                        <UpdatePatientForm
                                            patient={patient}
                                            onUpdate={handleUpdate}
                                            onClose={handleCloseForm} // Передаем функцию для закрытия формы
                                        />
                                    ) : (
                                        <>
                                            <Link to={`/patients/${patient.id}/diagnoses`} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                                                <ListItemText
                                                    primary={`${patient.last_name} ${patient.first_name} ${patient.patronymic ? patient.patronymic : ''}`}
                                                    secondary={`Дата рождения: ${patient.date_of_birth}`}
                                                />
                                            </Link>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                <IconButton aria-label="edit" onClick={() => setIsEdit(patient.id)} sx={{ marginRight: 1 }}>
                                                    <Edit />
                                                </IconButton>
                                                <IconButton aria-label="delete" onClick={() => handleDelete(patient.id)}>
                                                    <Delete />
                                                </IconButton>
                                            </Box>
                                        </>
                                    )}
                                </ListItem>
                            </Paper>
                        ))}
                    </List>
                ) : (
                    <Alert severity="info" sx={{ mt: 10, width: '90%', marginLeft: 'auto', marginRight: 'auto' }}>Пациентов нет</Alert>
                )
            )}
        </Box>
    );
});

export default PatientList;
