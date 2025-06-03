import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { PasswordResetScreen } from '../screens/auth/PasswordResetScreen';
import { EmailVerificationScreen } from '../screens/auth/EmailVerificationScreen';

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    PasswordReset: undefined;
    EmailVerification: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
            <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
        </Stack.Navigator>
    );
};

export default AuthStackNavigator; 