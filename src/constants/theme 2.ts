import { createTheme } from '@rneui/themed';
import type { Theme } from '@react-navigation/native';

export const theme = createTheme({
  lightColors: {
    primary: '#6200ee',
    secondary: '#03dac6',
    background: '#f6f6f6',
    error: '#b00020',
    grey0: '#000000',
    grey1: 'rgba(0, 0, 0, 0.26)',
    grey2: 'rgba(0, 0, 0, 0.54)',
    grey3: 'rgba(0, 0, 0, 0.5)',
    grey4: '#f50057',
  },
  darkColors: {
    primary: '#bb86fc',
    secondary: '#03dac6',
    background: '#121212',
    error: '#cf6679',
    grey0: '#ffffff',
    grey1: 'rgba(255, 255, 255, 0.38)',
    grey2: 'rgba(255, 255, 255, 0.38)',
    grey3: 'rgba(0, 0, 0, 0.5)',
    grey4: '#ff80ab',
  },
  mode: 'light',
  components: {
    Button: {
      raised: true,
    },
    Text: {
      h1Style: {
        fontSize: 32,
        fontWeight: 'bold',
      },
      h2Style: {
        fontSize: 24,
        fontWeight: 'bold',
      },
      h3Style: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      h4Style: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
  },
});

export const navigationTheme: Theme = {
  dark: false,
  colors: {
    primary: '#6200ee',
    background: '#f6f6f6',
    card: '#f6f6f6',
    text: '#000000',
    border: '#E0E0E0',
    notification: '#f50057',
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: 'bold',
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '900',
    },
  },
};


