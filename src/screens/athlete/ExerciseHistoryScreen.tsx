import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { fetchExerciseSessions, BasicExerciseInfo } from '../../services/HealthConnect/ExerciseSessionService';
import ExerciseCard from '../../components/cards/ExerciseCard';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    ExerciseHistory: undefined;
    ExerciseDetails: { session: BasicExerciseInfo };
};

const ExerciseHistoryScreen = () => {
    const [exercises, setExercises] = useState<BasicExerciseInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchExerciseSessions();
                setExercises(data);
            } catch (error) {
                console.error('Egzersiz geçmişi alınamadı:', error);
                Alert.alert('Hata', 'Egzersiz geçmişi alınırken bir sorun oluştu.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>🏃 Exercise History</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#bb86fc" />
            ) : (
                <FlatList
                    data={exercises}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ExerciseCard
                            exercise={item}
                            onPress={() => navigation.navigate('ExerciseDetails', { session: item })}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingHorizontal: 16,
        paddingTop: 40,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 20,
    },
    listContent: {
        paddingBottom: 20,
    },
});

export default ExerciseHistoryScreen;
