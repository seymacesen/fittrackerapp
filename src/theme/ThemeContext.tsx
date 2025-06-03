import React, { createContext, useContext } from 'react';
import { getTheme, Theme } from './theme';
import { useColorScheme } from 'react-native';

interface ThemeContextType {
    theme: Theme;
}

export const ThemeContext = createContext<ThemeContextType>({ theme: getTheme('dark') });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const colorScheme = useColorScheme();
    const currentTheme = getTheme(colorScheme);

    return (
        <ThemeContext.Provider value={{ theme: currentTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context.theme;
}; 