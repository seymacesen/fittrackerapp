import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { fetchCalorieSamplesByDate } from '../../services/HealthConnect/CaloriesService';
import CalorieChart from '../../components/charts/CalorieChart';
import MiniStat from '../../components/stats/MiniStat';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CalorieSample {
    time: string;
    calories: number;
}

const CalorieHistoryScreen = () => {
    const navigation = useNavigation();
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [data, setData] = useState<CalorieSample[]>([]);
    const [loading, setLoading] = useState(true);
    const [calendarVisible, setCalendarVisible] = useState(false);

    const loadData = useCallback(async (date: string) => {
        setLoading(true);
        try {
            const result = await fetchCalorieSamplesByDate(date);
            setData(result);
        } catch (error) {
            console.error('Failed to fetch calorie data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData(selectedDate);
    }, [selectedDate]);

    const onGestureEvent = useCallback((event: PanGestureHandlerGestureEvent) => {
        const { translationX, state } = event.nativeEvent;
        if (state === State.END) {
            if (translationX > 50) {
                setSelectedDate(prev => dayjs(prev).subtract(1, 'day').format('YYYY-MM-DD'));
            } else if (translationX < -50) {
                setSelectedDate(prev => dayjs(prev).add(1, 'day').format('YYYY-MM-DD'));
            }
        }
    }, []);

    // Calculate calorie stats
    const total = data.length > 0 ? Math.round(data.reduce((sum, d) => sum + d.calories, 0)) : 0;
    const max = data.length > 0 ? Math.max(...data.map(d => d.calories)) : 0;
    const min = data.length > 0 ? Math.min(...data.map(d => d.calories)) : 0;
    const lastSample = data.length > 0 ? data[data.length - 1] : null;

    return (
        <PanGestureHandler onHandlerStateChange={onGestureEvent}>
            <View style={styles.container}>

                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back-ios" size={22} color="#fff" />
                </TouchableOpacity>

                <ScrollView style={styles.scrollViewContent} contentContainerStyle={{ paddingBottom: 32 }}>
                    <View style={styles.topSection}>
                        <View style={styles.centeredTopContent}>
                            <Text style={styles.screenTitle}>Calories</Text>
                            <TouchableOpacity onPress={() => setCalendarVisible(true)} activeOpacity={0.8} style={styles.dateRow}>
                                <Text style={styles.selectedDateText}>
                                    {new Date(selectedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </Text>
                                <Text style={styles.dropdownIcon}>▼</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.totalValueContainerLeftAligned}>
                            <Text style={styles.totalValue}>{total}</Text>
                            <Text style={styles.totalUnit}>kcal</Text>
                        </View>
                    </View>


                    <Modal
                        visible={calendarVisible}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setCalendarVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalCalendarContainer}>
                                <Calendar
                                    onDayPress={(day) => {
                                        setSelectedDate(day.dateString);
                                        setCalendarVisible(false);
                                    }}
                                    markedDates={{
                                        [selectedDate]: { selected: true, selectedColor: '#f46409' },
                                    }}
                                    theme={{
                                        backgroundColor: '#232323',
                                        calendarBackground: '#232323',
                                        dayTextColor: '#fff',
                                        monthTextColor: '#f46409',
                                        arrowColor: '#f46409',
                                    }}
                                    style={styles.calendar}
                                />
                                <TouchableOpacity onPress={() => setCalendarVisible(false)} style={styles.closeModalBtn}>
                                    <Text style={styles.closeModalText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <View style={styles.chartCard}>
                        {loading ? (
                            <ActivityIndicator size="large" color="#f46409" />
                        ) : data.length === 0 ? (
                            <Text style={styles.empty}>No data found for {selectedDate}</Text>
                        ) : (
                            <CalorieChart data={data} chartColor={'#f46409'} />
                        )}
                    </View>

                    <View style={styles.statsRow}>
                        <MiniStat label="Total" value={total ?? '-'} unit="kcal" />
                    </View>

                    <TouchableOpacity style={styles.infoCard}>
                        <View>
                            <Text style={styles.infoCardTitle}>Daily Summary</Text>
                            <Text style={styles.infoCardValue}>{total} kcal Total</Text>
                        </View>
                        <Icon name="chevron-right" size={24} color="#bbb" />
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </PanGestureHandler>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        padding: 0,
    },
    scrollViewContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    backButton: {
        position: 'absolute',
        top: 24,
        left: 16,
        zIndex: 1,
    },
    topSection: {
        marginTop: 24,
        marginBottom: 16,
        paddingHorizontal: 16,
        alignItems: 'flex-start',
    },
    centeredTopContent: {
        alignSelf: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    screenTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    selectedDateText: {
        fontSize: 16,
        color: '#bbb',
        marginBottom: 8,
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 2,
    },
    totalValueContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    totalValueContainerLeftAligned: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    totalValue: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
        marginRight: 6,
    },
    totalUnit: {
        fontSize: 18,
        color: '#bbb',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    valueDate: {
        fontSize: 14,
        color: '#bbb',
        marginBottom: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCalendarContainer: {
        backgroundColor: '#232323',
        borderRadius: 16,
        padding: 16,
        width: '90%',
        alignItems: 'center',
    },
    closeModalBtn: {
        marginTop: 12,
        backgroundColor: '#f46409',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 24,
    },
    closeModalText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    calendar: {
        borderRadius: 12,
        overflow: 'hidden',
        width: '100%',
    },
    chartCard: {
        backgroundColor: '#1e1e1e',
        borderRadius: 16,
        marginVertical: 12,
        padding: 8,
        elevation: 2,
    },
    empty: {
        color: '#bbb',
        marginTop: 40,
        fontSize: 16,
        textAlign: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 12,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        width: undefined,
    },
    dropdownIcon: {
        color: '#f46409',
        fontSize: 18,
        marginLeft: 6,
    },
    infoCard: {
        backgroundColor: '#1e1e1e',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    infoCardTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    infoCardValue: {
        color: '#bbb',
        fontSize: 14,
    },
});

export default CalorieHistoryScreen;