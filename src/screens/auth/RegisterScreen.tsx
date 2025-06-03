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

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await AuthService.signUp(email, password);
            await AuthService.signOut();
            Alert.alert(
                'Success',
                'Registration completed. Please verify your email.',
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
            );
        } catch (error) {
            Alert.alert('Registration Error', error instanceof Error ? error.message : 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>Register</Text>

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
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={[styles.input, {
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text.primary,
                    borderColor: theme.colors.border
                }]}
                placeholder="Password"
                placeholderTextColor={theme.colors.text.secondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TextInput
                style={[styles.input, {
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text.primary,
                    borderColor: theme.colors.border
                }]}
                placeholder="Confirm Password"
                placeholderTextColor={theme.colors.text.secondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.primary }]}
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={theme.colors.text.primary} />
                ) : (
                    <Text style={[styles.buttonText, { color: theme.colors.text.primary }]}>
                        Register
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.loginLink}
            >
                <Text style={[styles.loginText, { color: theme.colors.text.secondary }]}>
                    Already have an account? Login
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
        marginBottom: 30,
        textAlign: 'center',
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
    loginLink: {
        marginTop: 20,
        alignItems: 'center',
    },
    loginText: {
        fontSize: 16,
    },
}); 