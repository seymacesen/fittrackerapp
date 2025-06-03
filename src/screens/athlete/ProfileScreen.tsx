import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { AuthService } from '../../services/AuthService';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            await AuthService.signOut();
            // Firebase onAuthStateChanged listener in MainStackNavigator will handle navigation after logout
        } catch (error) {
            Alert.alert('Logout Error', error instanceof Error ? error.message : 'Failed to logout');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>Profile</Text>
            {/* Kullanıcı bilgileri buraya eklenebilir */}

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    logoutButton: {
        marginTop: 40,
        backgroundColor: '#FF1E1E',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    logoutButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ProfileScreen; 