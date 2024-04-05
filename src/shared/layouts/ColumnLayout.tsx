import { Box } from '@mui/material';
import Header from '../../components/Header/Header.tsx';
import { type FC, type PropsWithChildren } from 'react';

export const ColumnLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Header />
            {children}
        </Box>
    );
};
