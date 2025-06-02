import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { fetchDailySteps } from '../../services/HealthConnect/StepService';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BarChart } from 'react-native-chart-kit';
import CalendarModal from '../../components/common/CalendarModal';
import { useTheme } from '../../theme/ThemeContext';

const screenWidth = Dimensions.get('window').width;

const StepHistoryScreen = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const [selectedStartDate, setSelectedStartDate] = useState<string>(dayjs().subtract(6, 'day').format('YYYY-MM-DD')); // Default to 7 days ago
    const [selectedEndDate, setSelectedEndDate] = useState<string>(dayjs().format('YYYY-MM-DD')); // Default to today
    const [stepData, setStepData] = useState<{ date: string; steps: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [calendarVisible, setCalendarVisible] = useState(false);

    const loadStepData = useCallback(async () => {
        setLoading(true);
        try {
            const startDate = new Date(selectedStartDate);
            const endDate = new Date(selectedEndDate);
            // Adjust end date to include the whole day
            endDate.setHours(23, 59, 59, 999);

            const data = await fetchDailySteps(startDate, endDate);
            setStepData(data);
        } catch (error) {
            console.error('Adım verisi alınamadı:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedStartDate, selectedEndDate]);

    useEffect(() => {
        loadStepData();
    }, [selectedStartDate, selectedEndDate]);

    const onDayPressCalendar = (day: any) => {
        // Handle date selection logic here (e.g., select start, select end)
        // For simplicity, let's just select a single day for now or handle a range.
        // A common pattern is to select the start date on first tap, and end date on second tap.
        // Let's implement a simple range selection: first tap is start, second tap is end.

        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            // If no start date selected, or both selected, start a new selection
            setSelectedStartDate(day.dateString);
            setSelectedEndDate(''); // Clear end date
        } else if (day.dateString >= selectedStartDate) {
            // Select end date
            setSelectedEndDate(day.dateString);
            setCalendarVisible(false); // Close calendar after selecting range
        } else {
            // If selected date is before start date, start a new selection
            setSelectedStartDate(day.dateString);
            setSelectedEndDate(''); // Clear end date
        }
    };

    // Helper to mark dates on calendar
    const markedDates = () => {
        const marked: any = {};
        let currentDate = dayjs(selectedStartDate);
        const end = dayjs(selectedEndDate);

        while (currentDate.isBefore(end) || currentDate.isSame(end, 'day')) {
            marked[currentDate.format('YYYY-MM-DD')] = { selected: true, color: '#a0c4ff', textColor: '#121212' };
            currentDate = currentDate.add(1, 'day');
        }
        if (selectedStartDate && !selectedEndDate) { // Mark only start date if end date is not selected yet
            marked[selectedStartDate] = { selected: true, color: '#a0c4ff', textColor: '#121212' };
        }

        return marked;
    };

    // Prepare data for the chart
    const chartLabels = stepData.map(day => dayjs(day.date).format('MM/DD')); // Format labels as MM/DD
    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                data: stepData.map(day => day.steps),
            },
        ],
    };

    // Calculate total steps in the period
    const totalSteps = stepData.reduce((sum, day) => sum + day.steps, 0);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                {/* Top Section: Title, Date Range, Total Steps */}
                <View style={styles.topSection}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back-ios" size={22} color={theme.colors.text.primary} />
                    </TouchableOpacity>
                    <View style={styles.centeredTopContent}>
                        <Text style={[styles.screenTitle, { color: theme.colors.text.primary }]}>Adım Geçmişi</Text>
                        <TouchableOpacity onPress={() => setCalendarVisible(true)} activeOpacity={0.8} style={styles.dateRangeRow}>
                            <Text style={[styles.selectedDateRangeText, { color: theme.colors.text.secondary }]}>
                                {`${dayjs(selectedStartDate).format('YYYY/MM/DD')} - ${selectedEndDate ? dayjs(selectedEndDate).format('YYYY/MM/DD') : 'Tarih Seç'}`}
                            </Text>
                            <Text style={[styles.dropdownIcon, { color: theme.colors.accent.steps }]}>▼</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Total Steps in Period */}
                    {!loading && (
                        <View style={styles.totalStepsContainer}>
                            <Text style={styles.totalStepsValue}>{totalSteps}</Text>
                            <Text style={styles.totalStepsUnit}>adım</Text>
                        </View>
                    )}
                </View>

                <CalendarModal
                    visible={calendarVisible}
                    onClose={() => setCalendarVisible(false)}
                    onDayPress={onDayPressCalendar}
                    selectedDate={selectedStartDate}
                />

                {/* Step Chart */}
                <View style={styles.chartContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#a0c4ff" />
                    ) : stepData.length === 0 ? (
                        <Text style={styles.emptyChart}>Grafik verisi bulunamadı.</Text>
                    ) : (
                        <BarChart
                            data={chartData}
                            width={screenWidth - 32}
                            height={220}
                            yAxisLabel=""
                            yAxisSuffix=" adım"
                            chartConfig={{
                                backgroundColor: '#232323',
                                backgroundGradientFrom: '#232323',
                                backgroundGradientTo: '#232323',
                                decimalPlaces: 0, // Steps are whole numbers
                                color: (opacity = 1) => `rgba(160, 196, 255, ${opacity})`, // Default color
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                                propsForVerticalLabels: {
                                    fontSize: 10,
                                },
                                propsForBackgroundLines: {
                                    strokeWidth: 1,
                                    stroke: 'rgba(255, 255, 255, 0.1)',
                                    strokeDasharray: '0',
                                },
                            }}
                            style={styles.chart}
                            fromZero={true}
                            showValuesOnTopOfBars={true}
                        />
                    )}
                </View>

                {/* Daily Step Details */}
                <View style={styles.detailsContainer}>
                    <Text style={styles.sectionTitle}>Günlük Detaylar</Text>
                    {loading ? (
                        <ActivityIndicator size="large" color="#a0c4ff" />
                    ) : stepData.length === 0 ? (
                        <Text style={styles.empty}>Adım verisi bulunamadı.</Text>
                    ) : (
                        stepData.map((day, index) => (
                            <View key={index} style={styles.dayItem}>
                                <Text style={styles.dayText}>
                                    {dayjs(day.date).format('YYYY/MM/DD')}
                                </Text>
                                <Text style={styles.stepsText}>{day.steps} adım</Text>
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
    dateRangeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    selectedDateRangeText: {
        fontSize: 16,
        color: '#bbb',
        marginBottom: 8,
    },
    dropdownIcon: {
        color: '#a0c4ff',
        fontSize: 18,
        marginLeft: 6,
    },
    totalStepsContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: 8,
    },
    totalStepsValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    totalStepsUnit: {
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
    stepsText: {
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

export default StepHistoryScreen; 