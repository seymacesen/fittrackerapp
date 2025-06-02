import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BarChart } from 'react-native-chart-kit';
import { fetchWeeklySleepData } from '../../services/HealthConnect/SleepService';
import dayjs from 'dayjs';

const screenWidth = Dimensions.get('window').width;

const SleepHistoryScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [weeklyData, setWeeklyData] = useState<{ date: string; hours: number }[]>([]);

    const loadWeeklyData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchWeeklySleepData();
            setWeeklyData(data);
        } catch (error) {
            console.error('Haftalık uyku verisi alınamadı:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadWeeklyData();
    }, []);

    // Format date for display (e.g., "Pzt", "Sal", etc.)
    const formatDateLabel = (dateString: string) => {
        const date = new Date(dateString);
        const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
        return days[date.getDay()];
    };

    // Calculate average sleep hours
    const averageSleepHours = weeklyData.length > 0
        ? (weeklyData.reduce((sum, day) => sum + day.hours, 0) / weeklyData.length).toFixed(1)
        : 0;

    // Prepare data for the chart
    const chartData = {
        labels: weeklyData.map(day => formatDateLabel(day.date)),
        datasets: [
            {
                data: weeklyData.map(day => day.hours),
            },
        ],
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                {/* Top Section: Title and Average */}
                <View style={styles.topSection}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back-ios" size={22} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.centeredTopContent}>
                        <Text style={styles.screenTitle}>Haftalık Uyku</Text>
                        <View style={styles.averageContainer}>
                            <Text style={styles.averageLabel}>Ortalama</Text>
                            <Text style={styles.averageValue}>{averageSleepHours}</Text>
                            <Text style={styles.averageUnit}>saat</Text>
                        </View>
                    </View>
                </View>

                {/* Weekly Sleep Chart */}
                <View style={styles.chartContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#a0c4ff" />
                    ) : weeklyData.length === 0 ? (
                        <Text style={styles.emptyChart}>Grafik verisi bulunamadı.</Text>
                    ) : (
                        <BarChart
                            data={chartData}
                            width={screenWidth - 32}
                            height={220}
                            yAxisLabel=""
                            yAxisSuffix="s"
                            chartConfig={{
                                backgroundColor: '#232323',
                                backgroundGradientFrom: '#232323',
                                backgroundGradientTo: '#232323',
                                decimalPlaces: 1,
                                color: (opacity = 1) => `rgba(15, 41, 193, 1.0)`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                                propsForVerticalLabels: {
                                    fontSize: 12,
                                },
                                propsForBackgroundLines: {
                                    strokeWidth: 1,
                                    stroke: 'rgba(255, 255, 255, 0.1)',
                                    strokeDasharray: '0',
                                    x: 0,
                                },
                            }}
                            style={styles.chart}
                            fromZero={true}
                            showValuesOnTopOfBars={true}
                        />
                    )}
                </View>

                {/* Daily Sleep Details */}
                <View style={styles.detailsContainer}>
                    <Text style={styles.sectionTitle}>Günlük Detaylar</Text>
                    {loading ? (
                        <ActivityIndicator size="large" color="#a0c4ff" />
                    ) : weeklyData.length === 0 ? (
                        <Text style={styles.empty}>Uyku verisi bulunamadı.</Text>
                    ) : (
                        weeklyData.map((day, index) => (
                            <View key={index} style={styles.dayItem}>
                                <Text style={styles.dayText}>
                                    {new Date(day.date).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </Text>
                                <Text style={styles.hoursText}>{day.hours} saat</Text>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        padding: 0,
    },
    topSection: {
        alignItems: 'flex-start',
        marginTop: 24,
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    backButton: {
        position: 'absolute',
        top: 24,
        left: 16,
        zIndex: 1,
    },
    screenTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    centeredTopContent: {
        alignSelf: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    averageContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: 8,
    },
    averageLabel: {
        fontSize: 16,
        color: '#bbb',
        marginRight: 8,
    },
    averageValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    averageUnit: {
        fontSize: 16,
        color: '#bbb',
        marginLeft: 4,
    },
    chartContainer: {
        backgroundColor: '#232323',
        borderRadius: 16,
        padding: 8,
        marginVertical: 12,
        elevation: 2,
        alignItems: 'center',
    },
    chart: {
        borderRadius: 16,
    },
    emptyChart: {
        color: '#bbb',
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
        paddingVertical: 80,
    },
    detailsContainer: {
        backgroundColor: '#232323',
        borderRadius: 16,
        marginVertical: 12,
        padding: 16,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingBottom: 5,
    },
    dayItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    dayText: {
        fontSize: 16,
        color: '#fff',
    },
    hoursText: {
        fontSize: 16,
        color: '#a0c4ff',
        fontWeight: 'bold',
    },
    empty: {
        color: '#bbb',
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default SleepHistoryScreen; 