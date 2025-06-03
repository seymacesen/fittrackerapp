import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BarChart } from 'react-native-chart-kit';
import { fetchSleepSessionsByDate } from '../../services/HealthConnect/SleepService';
import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import CalendarModal from '../../components/common/CalendarModal';
import { useTheme } from '../../theme/ThemeContext';
import { SleepSessionRecord } from 'react-native-health-connect';

const screenWidth = Dimensions.get('window').width;

interface ProcessedSleepStage {
    stageName: 'awake' | 'light' | 'deep' | 'rem';
    durationMillis: number;
}

interface ProcessedSleepSession {
    startTime: string;
    endTime: string;
    totalDurationMillis: number;
    stagesSummary: ProcessedSleepStage[];
}

const SleepHistoryScreen = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
    const [processedSleepData, setProcessedSleepData] = useState<ProcessedSleepSession | null>(null);
    const [calendarVisible, setCalendarVisible] = useState(false);

    const mapHealthConnectStageToName = (
        stage: number
    ): 'awake' | 'light' | 'deep' | 'rem' | 'unknown' => {
        switch (stage) {
            case 1: return 'awake'; // User observation & Standard HC AWAKE
            case 4: return 'light'; // User observation
            case 5: return 'deep'; // User observation
            case 6: return 'rem'; // User observation
            case 2: return 'deep'; // Standard HC REM
            case 3: return 'deep'; // Standard HC Deep
            // case 7: // SLEEPING - General
            // case 0: // UNKNOWN
            default:
                return 'unknown'; // Handle unexpected stage values
        }
    };

    const loadSleepData = useCallback(async () => {
        setLoading(true);
        try {
            const sessions: SleepSessionRecord[] = await fetchSleepSessionsByDate(selectedDate);

            if (sessions.length > 0) {
                const combinedStageDurationsMillis: { [key: string]: number } = {
                    awake: 0,
                    light: 0,
                    deep: 0,
                    rem: 0,
                };

                let earliestStartTime: Dayjs | undefined;
                let latestEndTime: Dayjs | undefined;

                sessions.forEach(session => {
                    const sessionStart = dayjs(session.startTime);
                    const sessionEnd = dayjs(session.endTime);

                    if (sessionStart.isValid()) {
                        if (!earliestStartTime || sessionStart.isBefore(earliestStartTime)) {
                            earliestStartTime = sessionStart;
                        }
                    }
                    if (sessionEnd.isValid()) {
                        if (!latestEndTime || sessionEnd.isAfter(latestEndTime)) {
                            latestEndTime = sessionEnd;
                        }
                    }

                    if (session.stages) {
                        console.log("Processing session stages:", JSON.stringify(session.stages, null, 2));
                        session.stages.forEach(stage => {
                            const stageName = mapHealthConnectStageToName(stage.stage);
                            if (stageName !== 'unknown') {
                                const stageStartTime = dayjs(stage.startTime);
                                const stageEndTime = dayjs(stage.endTime);
                                if (stageStartTime.isValid() && stageEndTime.isValid() && stageEndTime.isAfter(stageStartTime)) {
                                    const stageDurationMillis = stageEndTime.diff(stageStartTime);
                                    console.log(`Stage: ${stage.stage} (${stageName}), Duration (ms): ${stageDurationMillis}, Time: ${stageStartTime.format('HH:mm:ss')} - ${stageEndTime.format('HH:mm:ss')}`);
                                    combinedStageDurationsMillis[stageName] += stageDurationMillis;
                                }
                            }
                        });
                        console.log("Combined durations after session:", combinedStageDurationsMillis);
                    }
                });

                const stagesSummary: ProcessedSleepStage[] = Object.keys(combinedStageDurationsMillis)
                    .map(stageKey => ({
                        stageName: stageKey as 'awake' | 'light' | 'deep' | 'rem',
                        durationMillis: combinedStageDurationsMillis[stageKey],
                    }))
                    .filter(stage => stage.durationMillis > 0);

                stagesSummary.sort((a, b) => {
                    const order = ['deep', 'light', 'rem', 'awake'];
                    return order.indexOf(a.stageName) - order.indexOf(b.stageName);
                });
                console.log("Final stages summary:", stagesSummary);

                const totalSessionDurationMillis = earliestStartTime && latestEndTime && latestEndTime.isAfter(earliestStartTime)
                    ? latestEndTime.diff(earliestStartTime)
                    : 0;
                console.log("Calculated total session duration (ms):", totalSessionDurationMillis);

                setProcessedSleepData({
                    startTime: earliestStartTime ? earliestStartTime.toISOString() : '',
                    endTime: latestEndTime ? latestEndTime.toISOString() : '',
                    totalDurationMillis: totalSessionDurationMillis,
                    stagesSummary,
                });

            } else {
                setProcessedSleepData(null);
            }

        } catch (error) {
            console.error('Failed to fetch sleep data:', error);
            setProcessedSleepData(null);
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        loadSleepData();
    }, [selectedDate]);

    const onDayPressCalendar = (day: any) => {
        setSelectedDate(day.dateString);
        setCalendarVisible(false);
    };

    const markedDates = () => {
        const marked: any = {};
        marked[selectedDate] = {
            selected: true,
            selectedColor: theme.colors.accent.sleep,
            selectedTextColor: theme.colors.background,
        };
        return marked;
    };

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

    return (
        <PanGestureHandler onHandlerStateChange={onGestureEvent}>
            <View style={{ flex: 1 }}>
                <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                    <View style={styles.topSection}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Icon name="arrow-back-ios" size={22} color={theme.colors.text.primary} />
                        </TouchableOpacity>
                        <View style={styles.centeredTopContent}>
                            <Text style={[styles.screenTitle, { color: theme.colors.text.primary }]}>Sleep</Text>
                            <TouchableOpacity onPress={() => setCalendarVisible(true)} activeOpacity={0.8} style={styles.dateRow}>
                                <Text style={[styles.selectedDateText, { color: theme.colors.text.primary }]}>
                                    {dayjs(selectedDate).format('YYYY/MM/DD dddd')}
                                </Text>
                                <Text style={[styles.dropdownIcon, { color: theme.colors.accent.sleep }]}>▼</Text>
                            </TouchableOpacity>
                        </View>
                        {!loading && processedSleepData && typeof processedSleepData.totalDurationMillis === 'number' && processedSleepData.totalDurationMillis > 0 && processedSleepData.startTime && processedSleepData.endTime && (
                            <View style={styles.totalSleepContainer}>
                                <Text style={[styles.totalSleepValue, { color: theme.colors.accent.sleep }]}>
                                    {dayjs.duration(processedSleepData.totalDurationMillis).format('H [sa.] m [dk.]')}
                                </Text>
                                <Text style={[styles.sleepTimeRange, { color: theme.colors.text.secondary }]}>
                                    {`${dayjs(processedSleepData.startTime).format('HH:mm')} - ${dayjs(processedSleepData.endTime).format('HH:mm')}`}
                                </Text>
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

                    <View style={[styles.detailsContainer, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, borderBottomColor: theme.colors.border }]}>Sleep Stages</Text>
                        {loading ? (
                            <ActivityIndicator size="large" color={theme.colors.accent.sleep} />
                        ) : processedSleepData && processedSleepData.stagesSummary.length > 0 ? (
                            processedSleepData.stagesSummary.map((stageInfo, index) => {
                                const totalStagesDurationMillis = processedSleepData.stagesSummary.reduce((sum, s) => sum + s.durationMillis, 0);
                                const percentage = totalStagesDurationMillis > 0 ? (stageInfo.durationMillis / totalStagesDurationMillis) * 100 : 0;
                                const formattedDuration = dayjs.duration(stageInfo.durationMillis).format('H [sa.] m [dk.]');
                                const stageName = stageInfo.stageName.charAt(0).toUpperCase() + stageInfo.stageName.slice(1);
                                const stageColor = {
                                    'Awake': theme.colors.stages.awake,
                                    'Light': theme.colors.stages.light,
                                    'Deep': theme.colors.stages.deep,
                                    'Rem': theme.colors.stages.rem,
                                }[stageName] || theme.colors.text.primary;

                                return (
                                    <View key={index} style={[styles.stageItem, { borderBottomColor: index === processedSleepData.stagesSummary.length - 1 ? 'transparent' : theme.colors.border }]}>
                                        <View style={styles.stageInfo}>
                                            <Text style={[styles.stageName, { color: stageColor }]}>{stageName}</Text>
                                            <Text style={[styles.stageDuration, { color: theme.colors.text.secondary }]}>{formattedDuration}</Text>
                                        </View>
                                        {totalStagesDurationMillis > 0 && (
                                            <Text style={[styles.stagePercentage, { color: theme.colors.text.secondary }]}>{percentage.toFixed(0)}%</Text>
                                        )}
                                    </View>
                                );
                            })
                        ) : (
                            <Text style={[styles.empty, { color: theme.colors.text.secondary }]}>No sleep data available for this day.</Text>
                        )}
                    </View>
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
        marginBottom: 4,
    },
    centeredTopContent: {
        alignSelf: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    selectedDateText: {
        fontSize: 16,
    },
    dropdownIcon: {
        fontSize: 18,
        marginLeft: 6,
    },
    totalSleepContainer: {
        alignItems: 'center',
        marginTop: 8,
    },
    totalSleepValue: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    sleepTimeRange: {
        fontSize: 16,
        marginTop: 4,
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
        marginBottom: 10,
        borderBottomWidth: 1,
        paddingBottom: 5,
    },
    stageItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    stageInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stageName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    stageDuration: {
        fontSize: 16,
    },
    stagePercentage: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    empty: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default SleepHistoryScreen; 