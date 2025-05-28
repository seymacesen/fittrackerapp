// src/screens/athlete/HeartRateHistoryScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { fetchHeartRateSamplesByDate } from '../../services/HealthConnect/HeartRateService';
import HeartRateChart from '../../components/charts/HeartRateChart';
import HeartRateCard from '../../components/cards/HeartRateCard';
import MiniStat from '../../components/stats/MiniStat';
import HeartRateZonesBar from '../../components/charts/HeartRateZonesBar';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import dayjs from 'dayjs';

interface HeartRateSample {
    time: string;
    bpm: number;
}

const HeartRateHistoryScreen = () => {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [data, setData] = useState<HeartRateSample[]>([]);
    const [loading, setLoading] = useState(true);
    const [calendarVisible, setCalendarVisible] = useState(false);

    const loadData = useCallback(async (date: string) => {
        setLoading(true);
        try {
            const result = await fetchHeartRateSamplesByDate(date);
            setData(result);
        } catch (error) {
            console.error('Veri alınamadı:', error);
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
                // Swipe right: previous day
                setSelectedDate(prev => dayjs(prev).subtract(1, 'day').format('YYYY-MM-DD'));
            } else if (translationX < -50) {
                // Swipe left: next day
                setSelectedDate(prev => dayjs(prev).add(1, 'day').format('YYYY-MM-DD'));
            }
        }
    }, []);

    const average = data.length > 0 ? Math.round(data.reduce((sum, d) => sum + d.bpm, 0) / data.length) : null;
    const max = data.length > 0 ? Math.max(...data.map(d => d.bpm)) : null;
    const min = data.length > 0 ? Math.min(...data.map(d => d.bpm)) : null;
    const resting = data.length > 0 ? Math.min(...data.map(d => d.bpm)) + 10 : null; // Placeholder for resting
    const lastSample = data.length > 0 ? data[data.length - 1] : null;

    return (
        <PanGestureHandler onHandlerStateChange={onGestureEvent}>
            <View style={{ flex: 1 }}>
                <ScrollView style={styles.container}>
                    {/* Top Section: Title, Date, BPM */}
                    <View style={styles.topSection}>
                        <Text style={styles.screenTitle}>Heart Rate</Text>
                        <TouchableOpacity onPress={() => setCalendarVisible(true)} activeOpacity={0.8} style={styles.dateRow}>
                            <Text style={styles.selectedDateText}>
                                {new Date(selectedDate).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
                            </Text>
                            <Text style={styles.dropdownIcon}>▼</Text>
                        </TouchableOpacity>
                        {lastSample && (
                            <View style={styles.bpmContainer}>
                                <Text style={styles.bpmValue}>{lastSample.bpm}</Text>
                                <Text style={styles.bpmUnit}>BPM</Text>
                            </View>
                        )}
                        {lastSample && (
                            <Text style={styles.bpmDate}>{new Date(lastSample.time).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                        )}
                    </View>
                    {/* Calendar Modal */}
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
                                        [selectedDate]: { selected: true, selectedColor: '#f83d37' },
                                    }}
                                    theme={{
                                        backgroundColor: '#232323',
                                        calendarBackground: '#232323',
                                        dayTextColor: '#fff',
                                        monthTextColor: '#f83d37',
                                        arrowColor: '#f83d37',
                                    }}
                                    style={styles.calendar}
                                />
                                <TouchableOpacity onPress={() => setCalendarVisible(false)} style={styles.closeModalBtn}>
                                    <Text style={styles.closeModalText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    {/* Chart Card */}
                    <View style={styles.chartCard}>
                        {loading ? (
                            <ActivityIndicator size="large" color="#bb86fc" />
                        ) : data.length === 0 ? (
                            <Text style={styles.empty}>No data found for {selectedDate}</Text>
                        ) : (
                            <HeartRateChart data={data} />
                        )}
                    </View>
                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <MiniStat label="Min" value={min ?? '-'} unit="bpm" />
                        <MiniStat label="Avg" value={average ?? '-'} unit="bpm" />
                        <MiniStat label="Max" value={max ?? '-'} unit="bpm" />
                        <MiniStat label="Rest" value={resting ?? '-'} unit="bpm" />
                    </View>
                    {/* Heart Rate Zones Bar */}
                    {data.length > 0 && (
                        <HeartRateZonesBar age={23} data={data.map(d => d.bpm)} />
                    )}
                </ScrollView>
            </View>
        </PanGestureHandler>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 0,
    },
    topSection: {
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 16,
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
    bpmContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 2,
    },
    bpmValue: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
        marginRight: 6,
    },
    bpmUnit: {
        fontSize: 18,
        color: '#bbb',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    bpmDate: {
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
        backgroundColor: '#f83d37',
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
    hrCard: {
        marginHorizontal: 16,
        marginBottom: 8,
        marginTop: 0,
    },
    chartCard: {
        backgroundColor: '#1e1e1e',
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 12,
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
        justifyContent: 'space-between',
        marginHorizontal: 8,
        marginBottom: 24,
        marginTop: 4,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    dropdownIcon: {
        color: '#f83d37',
        fontSize: 18,
        marginLeft: 6,
    },
});

export default HeartRateHistoryScreen;
