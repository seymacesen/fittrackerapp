import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { AuthService } from '../../services/AuthService';
import { useTheme } from '../../theme/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStackNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'PasswordReset'>;

export const PasswordResetScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        try {
            setLoading(true);
            await AuthService.resetPassword(email);
            Alert.alert(
                'Success',
                'Password reset email has been sent. Please check your inbox.',
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
            );
        } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>Reset Password</Text>
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
                Enter your email address and we'll send you a link to reset your password.
            </Text>

            <TextInput
                style={[styles.input, {
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text.primary,
                    borderColor: theme.colors.border
                }]}
                placeholder="Email"
                placeholderTextColor={theme.colors.text.secondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.primary }]}
                onPress={handleResetPassword}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={theme.colors.text.primary} />
                ) : (
                    <Text style={[styles.buttonText, { color: theme.colors.text.primary }]}>
                        Send Reset Link
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.backLink}
            >
                <Text style={[styles.backText, { color: theme.colors.text.secondary }]}>
                    Back to Login
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    button: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    backLink: {
        marginTop: 20,
        alignItems: 'center',
    },
    backText: {
        fontSize: 16,
    },
}); 