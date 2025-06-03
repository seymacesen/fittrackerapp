import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { ColorSchemeName } from 'react-native';

// Define your custom colors
interface CustomColors {
    background: string;
    surface: string;
    card: string; // Used for cards/containers like chartContainer and detailsContainer
    primary: string;
    border: string;
    text: {
        primary: string;
        secondary: string;
    };
    accent: {
        heartRate: string;
        calories: string;
        steps: string;
        sleep: string; // Accent color for sleep (e.g., #0065F8 or similar)
        oxygen: string;
        vo2max: string;
        exercise: string; // Greenish color for exercise names/accents
    };
    stages: { // New: Colors for sleep stages
        awake: string;
        light: string;
        deep: string;
        rem: string;
    };
}

// Define your custom theme structure
interface CustomTheme {
    dark: boolean;
    colors: CustomColors;
}

// Custom Dark Theme based on your existing styles
const CustomDarkTheme: CustomTheme = {
    dark: true,
    colors: {
        background: '#000000', // Pure Black background
        surface: '#232323', // Slightly lighter surface for cards and containers
        card: '#232323', // Card background color (same as surface)
        primary: '#BB86FC', // A primary accent color (can be adjusted)
        border: '#333333', // Border color for separation
        text: {
            primary: '#FFFFFF', // White text for main content
            secondary: '#BBBBBB', // Lighter gray text for secondary info
        },
        accent: {
            heartRate: '#FF6347', // Tomato red
            calories: '#FFD700', // Gold
            steps: '#0065F8', // Your blue step color
            sleep: '#0065F8', // Using the same blue for sleep for now, can be changed
            oxygen: '#40E0D0', // Turquoise
            vo2max: '#98FB98', // PaleGreen
            exercise: '#00CC00', // A shade of green for exercise
        },
        stages: { // New: Define colors for sleep stages
            awake: '#FFA500', // Orange
            light: '#1E90FF', // DodgerBlue
            deep: '#4B0082', // Indigo
            rem: '#BA55D3', // MediumOrchid
        },
    },
};

// Custom Light Theme (basic structure, colors may need adjustment)
const CustomLightTheme: CustomTheme = {
    dark: false,
    colors: {
        background: '#FFFFFF',
        surface: '#F5F5F5',
        card: '#FFFFFF',
        primary: '#6200EE',
        border: '#E0E0E0',
        text: {
            primary: '#000000',
            secondary: '#555555',
        },
        accent: {
            heartRate: '#FF6347',
            calories: '#FFD700',
            steps: '#2196F3', // Material blue
            sleep: '#2196F3', // Material blue
            oxygen: '#00BCD4', // Cyan
            vo2max: '#8BC34A', // Light Green
            exercise: '#4CAF50', // Material green
        },
        stages: { // New: Define colors for sleep stages for light theme
            awake: '#FF9800', // Orange
            light: '#03A9F4', // Light Blue
            deep: '#673AB7', // Deep Purple
            rem: '#9C27B0', // Purple
        },
    },
};

export const getTheme = (colorScheme: ColorSchemeName): CustomTheme => {
    return colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme;
};

// Export the type for use in components
export type Theme = CustomTheme;
export type Colors = CustomColors;

// Remove the redundant export const theme object
/*
export const theme = {
    colors: {
        background: '#000000',
        surface: '#232323',
        card: '#232323',
        primary: '#BB86FC', // Example primary color
        border: '#333333',
        text: {
            primary: '#FFFFFF',
            secondary: '#BBBBBB',
        },
        accent: {
            heartRate: '#FF6347', // Tomato red
            calories: '#FFD700', // Gold
            steps: '#0065F8', // Your blue step color
            sleep: '#0065F8', // Using the same blue for sleep for now
            oxygen: '#40E0D0', // Turquoise
            vo2max: '#98FB98', // PaleGreen
            exercise: '#00CC00', // A shade of green
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
*/
// Remove the duplicate export type Theme = typeof theme; line

