import auth from '@react-native-firebase/auth';

export const AuthService = {
    // Email/Password ile kayıt
    signUp: async (email: string, password: string) => {
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            // Email doğrulama gönder
            await userCredential.user.sendEmailVerification();
            return userCredential.user;
        } catch (error: any) {
            throw new Error(error.message);
        }
    },

    // Email/Password ile giriş
    signIn: async (email: string, password: string) => {
        try {
            const userCredential = await auth().signInWithEmailAndPassword(email, password);
            // Email doğrulanmamışsa uyarı ver
            if (!userCredential.user.emailVerified) {
                throw new Error('Please verify your email before logging in.');
            }
            return userCredential.user;
        } catch (error: any) {
            throw new Error(error.message);
        }
    },

    // Çıkış yapma
    signOut: async () => {
        try {
            await auth().signOut();
        } catch (error: any) {
            throw new Error(error.message);
        }
    },

    // Şifre sıfırlama
    resetPassword: async (email: string) => {
        try {
            await auth().sendPasswordResetEmail(email);
        } catch (error: any) {
            throw new Error(error.message);
        }
    },

    // Email doğrulama mailini tekrar gönderme
    resendVerificationEmail: async () => {
        try {
            const user = auth().currentUser;
            if (user) {
                await user.sendEmailVerification();
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    },

    // Mevcut kullanıcıyı alma
    getCurrentUser: () => {
        return auth().currentUser;
    },

    // Kullanıcı durumu değişikliklerini dinleme
    onAuthStateChanged: (callback: (user: any) => void) => {
        return auth().onAuthStateChanged(callback);
    }
}; 