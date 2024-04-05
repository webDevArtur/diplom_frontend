// PatientsPage.tsx
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import PatientList from '../../components/patients/PatientList';
import AddPatientForm from '../../components/patients/AddPatientForm';
import {Button, Modal, Box, Typography} from '@mui/material';

const PatientsPage: React.FC = observer(() => {
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <div>
            <Typography variant="h4" sx={{ display: 'flex', justifyContent: 'center', marginTop: 4, marginBottom: 2, fontWeight: 'bold' }}>Страница пациентов</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginRight: 8, mt: 5 }} >
                <Button onClick={handleOpenModal} variant="contained" color="primary" >
                    Добавить пациента
                </Button>
            </Box>
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <AddPatientForm onClose={handleCloseModal} />
                </Box>
            </Modal>
            <PatientList />
        </div>
    );
});

export default PatientsPage;
