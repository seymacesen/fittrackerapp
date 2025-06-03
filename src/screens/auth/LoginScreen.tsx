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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            await AuthService.signIn(email, password);
        } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>Login</Text>

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

            <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.primary }]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={theme.colors.text.primary} />
                ) : (
                    <Text style={[styles.buttonText, { color: theme.colors.text.primary }]}>
                        Login
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                style={styles.registerLink}
            >
                <Text style={[styles.registerText, { color: theme.colors.text.secondary }]}>
                    Don't have an account? Register
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('PasswordReset')}
                style={styles.forgotPasswordLink}
            >
                <Text style={[styles.forgotPasswordText, { color: theme.colors.text.secondary }]}>
                    Forgot Password?
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
    registerLink: {
        marginTop: 20,
        alignItems: 'center',
    },
    registerText: {
        fontSize: 16,
    },
    forgotPasswordLink: {
        marginTop: 10,
        alignItems: 'center',
    },
    forgotPasswordText: {
        fontSize: 16,
    },
}); 