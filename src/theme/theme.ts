export const theme = {
    colors: {
        background: '#000000',
        surface: '#232323',
        card: '#1e1e1e',
        text: {
            primary: '#ffffff',
            secondary: '#bbbbbb',
        },
        accent: {
            heartRate: '#f83d37',
            calories: '#f46409',
            steps: '#a0c4ff',
            sleep: '#dcedc8',
            oxygen: '#4fc3f7',
            vo2max: '#81c784',
        }
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    borderRadius: {
        sm: 8,
        md: 16,
        lg: 24,
    }
};

export type Theme = typeof theme; 