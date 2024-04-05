import React, { useState } from 'react';
import rootStore from '../../store/RootStore';
import { observer } from 'mobx-react-lite';
import { Button, TextField, Box, Select, MenuItem, InputLabel } from '@mui/material';
import { Patient } from '../../models/PatientModel';

interface AddPatientFormProps {
    onClose: () => void;
}

const AddPatientForm: React.FC<AddPatientFormProps> = observer(({ onClose }) => {
    const [newPatient, setNewPatient] = useState<Omit<Patient, 'id'> & { date_of_birth: string }>({
        first_name: '',
        last_name: '',
        patronymic: '',
        gender: '',
        date_of_birth: new Date().toISOString().split('T')[0],
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({
        first_name: '',
        last_name: '',
        patronymic: '',
        gender: '',
        date_of_birth: '',
    });

    const patientStore = rootStore.patientStore;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPatient((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        // Clear the error when changing the input value
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Check for errors
        if (validateForm()) {
            // If no errors, submit the data
            await patientStore.createPatient(newPatient);
            setNewPatient({
                first_name: '',
                last_name: '',
                patronymic: '',
                gender: '',
                date_of_birth: new Date().toISOString().split('T')[0],
            });
            onClose();
        }
    };

    const validateForm = () => {
        let isValid = true;
        const errorsCopy = { ...errors };

        // Validate each field
        if (!newPatient.first_name) {
            errorsCopy.first_name = 'Введите имя';
            isValid = false;
        } else if (!isValidName(newPatient.first_name)) {
            errorsCopy.first_name = 'Имя не должно содержать цифры и латинские буквы';
            isValid = false;
        }
        if (!newPatient.last_name) {
            errorsCopy.last_name = 'Введите фамилию';
            isValid = false;
        } else if (!isValidName(newPatient.last_name)) {
            errorsCopy.last_name = 'Фамилия не должна содержать цифры и латинские буквы';
            isValid = false;
        }
        if (!newPatient.patronymic) {
            errorsCopy.patronymic = 'Введите отчество';
            isValid = false;
        } else if (!isValidName(newPatient.patronymic)) {
            errorsCopy.patronymic = 'Отчество не должно содержать цифры и латинские буквы';
            isValid = false;
        }
        if (!newPatient.gender) {
            errorsCopy.gender = 'Выберите пол';
            isValid = false;
        }
        if (!newPatient.date_of_birth) {
            errorsCopy.date_of_birth = 'Введите дату рождения';
            isValid = false;
        } else if (!isValidDate(newPatient.date_of_birth)) {
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
        const currentYear = currentDate.getFullYear();

        return (
            year >= 1900 &&
            year <= currentYear &&
            month >= 1 &&
            month <= 12 &&
            day >= 1 &&
            day <= 31 &&
            (
                year < currentYear
            )
        );
    };


    return (
        <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
            <h1 style={{ marginTop: 0 }}>Добавление пациента</h1>
            <Box sx={{ marginBottom: '16px', width: '90%' }}>
                <Box sx={{ marginBottom: '4px' }}>
                    <InputLabel>Имя</InputLabel>
                    <TextField
                        variant="outlined"
                        name="first_name"
                        value={newPatient.first_name}
                        onChange={handleInputChange}
                        error={!!errors.first_name}
                        helperText={errors.first_name}
                        sx={{ marginBottom: 1, width: '100%' }}
                    />
                </Box>
                <Box sx={{ marginBottom: '4px' }}>
                    <InputLabel>Фамилия</InputLabel>
                    <TextField
                        variant="outlined"
                        name="last_name"
                        value={newPatient.last_name}
                        onChange={handleInputChange}
                        error={!!errors.last_name}
                        helperText={errors.last_name}
                        sx={{ marginBottom: 1, width: '100%' }}
                    />
                </Box>
                <Box sx={{ marginBottom: '4px' }}>
                    <InputLabel>Отчество</InputLabel>
                    <TextField
                        variant="outlined"
                        name="patronymic"
                        value={newPatient.patronymic}
                        onChange={handleInputChange}
                        error={!!errors.patronymic}
                        helperText={errors.patronymic}
                        sx={{ marginBottom: 1, width: '100%' }}
                    />
                </Box>
                <Box sx={{ marginBottom: '16px' }}>
                    <InputLabel>Пол</InputLabel>
                    <Select
                        value={newPatient.gender}
                        onChange={(e) => setNewPatient((prevState) => ({ ...prevState, gender: e.target.value as string }))}
                        error={!!errors.gender}
                        sx={{ minWidth: '120px', width: '100%' }}
                    >
                        <MenuItem value="">Выберите пол</MenuItem>
                        <MenuItem value="Мужской">Мужской</MenuItem>
                        <MenuItem value="Женский">Женский</MenuItem>
                    </Select>
                </Box>
                <Box sx={{ marginBottom: '4px' }}>
                    <InputLabel>Дата рождения (гггг-мм-дд)</InputLabel>
                    <TextField
                        variant="outlined"
                        name="date_of_birth"
                        value={newPatient.date_of_birth}
                        onChange={handleInputChange}
                        error={!!errors.date_of_birth}
                        helperText={errors.date_of_birth}
                        sx={{ marginBottom: 1, width: '100%' }}
                    />
                </Box>
            </Box>

            <Button type="submit" variant="contained" color="primary" sx={{ width: '90%' }}>
                Добавить пациента
            </Button>
        </form>
    );
});

export default AddPatientForm;
