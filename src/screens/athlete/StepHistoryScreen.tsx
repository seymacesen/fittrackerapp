import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { fetchDailySteps, fetchStepsInIntervals } from '../../services/HealthConnect/StepService';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BarChart, LineChart } from 'react-native-chart-kit';
import CalendarModal from '../../components/common/CalendarModal';
import { useTheme } from '../../theme/ThemeContext';
import { fetchTotalDistanceByDate } from '../../services/HealthConnect/DistanceService';

const screenWidth = Dimensions.get('window').width;

const StepHistoryScreen = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD')); // State for single selected day
    const [stepData, setStepData] = useState<number[]>([]); // Data will be an array of step counts per interval
    const [loading, setLoading] = useState(true);
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [showDailyDetails, setShowDailyDetails] = useState(false); // State to control visibility
    const [totalDistance, setTotalDistance] = useState<number>(0); // State for total distance

    const loadStepData = useCallback(async () => {
        setLoading(true);
        try {
            const date = dayjs(selectedDate).toDate();
            const steps = await fetchStepsInIntervals(date, 30); // Fetch data in 30-minute intervals
            setStepData(steps);

            // Fetch total distance for the selected day
            const distance = await fetchTotalDistanceByDate(selectedDate);
            setTotalDistance(distance);

        } catch (error) {
            console.error('Failed to fetch step or distance data:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        loadStepData();
    }, [selectedDate]);

    const onDayPressCalendar = (day: any) => {
        setSelectedDate(day.dateString); // Select single day
        setCalendarVisible(false); // Close calendar
    };

    // Helper to mark dates on calendar (only selected day)
    const markedDates = () => {
        const marked: any = {};
        marked[selectedDate] = {
            selected: true,
            selectedColor: theme.colors.accent.steps,
            selectedTextColor: theme.colors.background,
        };
        return marked;
    };

    // Prepare data and labels for the chart (24 hours / 30 min intervals = 48 data points)
    const chartValues: number[] = [];
    const chartLabels: string[] = [];
    const mainHours = [0, 6, 12, 18]; // Only show labels at these hours
    const intervalMinutes = 30;
    const numberOfIntervals = (24 * 60) / intervalMinutes;

    for (let i = 0; i < numberOfIntervals; i++) {
        const intervalStart = dayjs(selectedDate).startOf('day').add(i * intervalMinutes, 'minute');
        const intervalEnd = intervalStart.add(intervalMinutes, 'minute');

        const steps = stepData[i] || 0;
        chartValues.push(steps);

        // Only add labels at specific hours
        if (intervalStart.minute() === 0 && mainHours.includes(intervalStart.hour())) {
            chartLabels.push(intervalStart.format('HH:mm'));
        } else {
            chartLabels.push(' ');
        }
    }

    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                data: chartValues,
            },
        ],
    };

    // Calculate total steps for the displayed period (which is now a single day)
    const totalSteps = chartValues.reduce((sum, steps) => sum + steps, 0);

    const onGestureEvent = useCallback((event: PanGestureHandlerGestureEvent) => {
        const { translationX, state } = event.nativeEvent;
        if (state === State.END) {
            if (translationX > 50) {
                // Swipe right: previous day
                setSelectedDate(prev => dayjs(prev).subtract(1, 'day').format('YYYY-MM-DD'));
            } else if (translationX < -50) {
                // Swipe left: next day
                setSelectedDate(prev => dayjs(prev).add(1, 'day').format('YYYY-MM-DD'));
            }
        }
    }, []);

    return (
        <PanGestureHandler onHandlerStateChange={onGestureEvent}>
            <View style={{ flex: 1 }}>
                <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                    {/* Top Section: Title, Date, Total Steps */}
                    <View style={styles.topSection}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Icon name="arrow-back-ios" size={22} color={theme.colors.text.primary} />
                        </TouchableOpacity>
                        <View style={styles.centeredTopContent}>
                            <Text style={[styles.screenTitle, { color: theme.colors.text.primary }]}>Steps</Text>
                            <TouchableOpacity onPress={() => setCalendarVisible(true)} activeOpacity={0.8} style={styles.dateRangeRow}>
                                <Text style={[styles.selectedDateRangeText, { color: theme.colors.text.secondary }]}>
                                    {dayjs(selectedDate).format('YYYY/MM/DD')}
                                </Text>
                                <Text style={[styles.dropdownIcon, { color: '#0065F8' }]}>▼</Text>
                            </TouchableOpacity>
                        </View>
                        {/* Total Steps in Period */}
                        {!loading && (
                            <View style={styles.totalStepsContainer}>
                                <Text style={styles.totalStepsValue}>{totalSteps}</Text>
                                <Text style={styles.totalStepsUnit}>steps</Text>
                            </View>
                        )}
                    </View>

                    <CalendarModal
                        visible={calendarVisible}
                        onClose={() => setCalendarVisible(false)}
                        onDayPress={onDayPressCalendar}
                        selectedDate={selectedDate}
                        marking={markedDates()}
                    />

                    {/* Step Chart */}
                    <View style={styles.chartContainer}>
                        {loading ? (
                            <ActivityIndicator size="large" color={theme.colors.accent.steps} />
                        ) : stepData.length === 0 ? (
                            <Text style={styles.emptyChart}>No chart data available.</Text>
                        ) : (
                            <LineChart
                                data={chartData}
                                width={screenWidth - 32}
                                height={220}
                                yAxisLabel=""
                                yAxisSuffix=" steps"
                                chartConfig={{
                                    backgroundColor: theme.colors.surface,
                                    backgroundGradientFrom: theme.colors.surface,
                                    backgroundGradientTo: theme.colors.surface,
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(0, 101, 248, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(${parseInt(theme.colors.text.primary.slice(1, 3), 16)}, ${parseInt(theme.colors.text.primary.slice(3, 5), 16)}, ${parseInt(theme.colors.text.primary.slice(5, 7), 16)}, ${opacity})`,
                                    style: {
                                        borderRadius: 16,
                                    },
                                    propsForVerticalLabels: {
                                        fontSize: 10,
                                    },
                                    propsForBackgroundLines: {
                                        strokeWidth: 1,
                                        stroke: theme.colors.border,
                                        strokeDasharray: '0',
                                    },
                                    propsForDots: { r: "0" },
                                    strokeWidth: 2,
                                    propsForLabels: {
                                        fontSize: 10,
                                        fill: theme.colors.text.primary,
                                    },
                                }}
                                bezier
                                style={styles.chart}
                            />
                        )}
                    </View>

                    {/* Daily Summary Section */}
                    {!loading && (
                        <View style={[styles.detailsContainer, { backgroundColor: theme.colors.surface }]}>
                            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, borderBottomColor: theme.colors.border }]}>Daily Summary</Text>
                            {
                                stepData.length === 0 ? (
                                    <Text style={[styles.empty, { color: theme.colors.text.secondary }]}>No data available for this day.</Text>
                                ) : (
                                    <>
                                        <View style={[styles.dayItem, { borderBottomColor: theme.colors.border }]}>
                                            <Text style={[styles.dayText, { color: theme.colors.text.primary }]}>Total Steps:</Text>
                                            <Text style={[styles.stepsText, { color: '#0065F8' }]}>{totalSteps}</Text>
                                        </View>
                                        <View style={[styles.dayItem, { borderBottomWidth: 0 }]}>
                                            <Text style={[styles.dayText, { color: theme.colors.text.primary }]}>Total Distance:</Text>
                                            <Text style={[styles.stepsText, { color: '#0065F8' }]}>{totalDistance.toFixed(2)} km</Text>
                                        </View>
                                    </>
                                )
                            }
                        </View>
                    )}

                    {/* Optional: Keep the detailed interval data section if needed */}
                    {showDailyDetails && (
                        <View style={styles.detailsContainer}>
                            <Text style={styles.sectionTitle}>Daily Details</Text>
                            {loading ? (
                                <ActivityIndicator size="large" color={theme.colors.accent.steps} />
                            ) : stepData.length === 0 ? (
                                <Text style={styles.empty}>No step data available.</Text>
                            ) : (
                                // Displaying data points from the intervals array
                                stepData.map((steps, index) => {
                                    const intervalStart = dayjs(selectedDate).startOf('day').add(index * 30, 'minute');
                                    const intervalEnd = intervalStart.add(30, 'minute');
                                    const timeRange = `${intervalStart.format('HH:mm')} - ${intervalEnd.format('HH:mm')}`;

                                    return (
                                        <View key={index} style={styles.dayItem}>
                                            <Text style={styles.dayText}>{timeRange}</Text>
                                            <Text style={styles.stepsText}>{steps} steps</Text>
                                        </View>
                                    );
                                })
                            )}
                        </View>
                    )}

                </ScrollView>
            </View>
        </PanGestureHandler>
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
        fontSize: 18,
        marginLeft: 6,
        color: '#0065F8',
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
        color: '#0065F8',
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