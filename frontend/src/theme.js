import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#2E7D32' }, // Forest Green
        secondary: { main: '#F57C00' }, // Sunset Orange
        background: { default: '#FFF3E0' }, // Cream White
        text: { primary: '#212121' }, // Dark Gray
    },
    typography: {
        fontFamily: "'Poppins', 'Open Sans', sans-serif",
        h4: { fontFamily: 'Poppins', fontWeight: 700 },
        h6: { fontFamily: 'Poppins', fontWeight: 600 },
        body1: { fontFamily: 'Open Sans', fontWeight: 400 },
        button: { fontFamily: 'Poppins', fontWeight: 600, textTransform: 'none' },
    },
});

export default theme;