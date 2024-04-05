import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Grid, TextField, Box } from '@mui/material';
import { Patient } from '../../models/PatientModel';

interface UpdatePatientFormProps {
    patient: Patient;
    onUpdate: (updatedPatient: Patient) => void;
    onClose: () => void;
}

const UpdatePatientForm: React.FC<UpdatePatientFormProps> = observer(({ patient, onUpdate, onClose }) => {
    const [updatedPatient, setUpdatedPatient] = useState<Patient>({ ...patient });
    const [errors, setErrors] = useState<{ [key: string]: string }>({
        first_name: '',
        last_name: '',
        patronymic: '',
        date_of_birth: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdatedPatient(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear the error when changing the input value
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Check for errors
        if (validateForm()) {
            onUpdate(updatedPatient);
        }
    };

    const validateForm = () => {
        let isValid = true;
        const errorsCopy = { ...errors };

        // Validate each field
        if (!updatedPatient.first_name) {
            errorsCopy.first_name = 'Введите имя';
            isValid = false;
        } else if (!isValidName(updatedPatient.first_name)) {
            errorsCopy.first_name = 'Имя не должно содержать цифры и латинские буквы';
            isValid = false;
        }
        if (!updatedPatient.last_name) {
            errorsCopy.last_name = 'Введите фамилию';
            isValid = false;
        } else if (!isValidName(updatedPatient.last_name)) {
            errorsCopy.last_name = 'Фамилия не должна содержать цифры и латинские буквы';
            isValid = false;
        }
        if (!updatedPatient.patronymic) {
            errorsCopy.patronymic = 'Введите отчество';
            isValid = false;
        } else if (!isValidName(updatedPatient.patronymic)) {
            errorsCopy.patronymic = 'Отчество не должно содержать цифры и латинские буквы';
            isValid = false;
        }
        if (!updatedPatient.date_of_birth) {
            errorsCopy.date_of_birth = 'Введите дату рождения';
            isValid = false;
        } else if (!isValidDate(updatedPatient.date_of_birth)) {
            errorsCopy.date_of_birth = 'Неверный формат даты или недопустимая дата';
            isValid = false;
        }

        // Update the error state
        setErrors(errorsCopy);
        return isValid;
    };

    const isValidName = (name: string) => {
        const nameRegex = /^[а-яА-ЯёЁ]+$/;
        return nameRegex.test(name);
    };

    const isValidDate = (date: string) => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) return false;

        const [year, month, day] = date.split('-').map(Number);
        const currentDate = new Date();
        const inputDate = new Date(year, month - 1, day); // month - 1, так как месяцы в объекте Date начинаются с 0

        return (
            inputDate.getFullYear() === year &&
            inputDate.getMonth() === month - 1 &&
            inputDate.getDate() === day &&
            inputDate <= currentDate // проверяем, что введенная дата не больше текущей даты
        );
    };


    const handleClose = () => {
        onClose();
    };

    return (
        <Box display="flex" justifyContent="center">
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Grid container spacing={2} >
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Имя"
                            variant="outlined"
                            name="first_name"
                            value={updatedPatient.first_name}
                            onChange={handleInputChange}
                            fullWidth
                            error={!!errors.first_name}
                            helperText={errors.first_name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Фамилия"
                            variant="outlined"
                            name="last_name"
                            value={updatedPatient.last_name}
                            onChange={handleInputChange}
                            fullWidth
                            error={!!errors.last_name}
                            helperText={errors.last_name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Отчество"
                            variant="outlined"
                            name="patronymic"
                            value={updatedPatient.patronymic}
                            onChange={handleInputChange}
                            fullWidth
                            error={!!errors.patronymic}
                            helperText={errors.patronymic}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Дата рождения"
                            variant="outlined"
                            name="date_of_birth"
                            value={updatedPatient.date_of_birth}
                            onChange={handleInputChange}
                            fullWidth
                            error={!!errors.date_of_birth}
                            helperText={errors.date_of_birth}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>Обновить пациента</Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button variant="contained" color="secondary" onClick={handleClose} fullWidth>Закрыть</Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
});

export default UpdatePatientForm;
