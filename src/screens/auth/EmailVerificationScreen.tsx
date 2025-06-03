import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { AuthService } from '../../services/AuthService';
import { useTheme } from '../../theme/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStackNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'EmailVerification'>;

export const EmailVerificationScreen: React.FC<Props> = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const theme = useTheme();

    const handleResendVerification = async () => {
        try {
            setLoading(true);
            await AuthService.resendVerificationEmail();
            Alert.alert('Success', 'Verification email has been resent. Please check your inbox.');
        } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to resend verification email');
        } finally {
            setLoading(false);
        }
    };

    const checkEmailVerification = async () => {
        try {
            setVerifying(true);
            const user = AuthService.getCurrentUser();
            if (user) {
                await user.reload();
                if (user.emailVerified) {
                    Alert.alert(
                        'Success',
                        'Email verified successfully!',
                        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
                    );
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to verify email status');
        } finally {
            setVerifying(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(checkEmailVerification, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>Verify Your Email</Text>
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
                Please check your email and click the verification link to continue.
            </Text>

            {verifying && (
                <View style={styles.verifyingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={[styles.verifyingText, { color: theme.colors.text.secondary }]}>
                        Checking verification status...
                    </Text>
                </View>
            )}

            <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.primary }]}
                onPress={handleResendVerification}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={theme.colors.text.primary} />
                ) : (
                    <Text style={[styles.buttonText, { color: theme.colors.text.primary }]}>
                        Resend Verification Email
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
    verifyingContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    verifyingText: {
        marginTop: 10,
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