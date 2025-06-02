import { readRecords } from 'react-native-health-connect';
import type { SleepSessionRecord } from 'react-native-health-connect';

// Fetch sleep sessions for a given date
export const fetchSleepSessionsByDate = async (
    selectedDate: string
): Promise<SleepSessionRecord[]> => {
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const { records } = await readRecords<'SleepSession'>('SleepSession', {
        timeRangeFilter: {
            operator: 'between',
            startTime: start.toISOString(),
            endTime: end.toISOString(),
        },
    });

    const sleepSessions = records as SleepSessionRecord[];

    console.log(`Fetched ${sleepSessions.length} sleep sessions for ${selectedDate}`);
    // Log stages for the first session to inspect the data structure
    if (sleepSessions.length > 0) {
        console.log("Stages for the first session:", sleepSessions[0].stages);
    }

    return sleepSessions;
};

// Existing fetchTodaySleepHours function (can keep for dashboard or other uses)
export const fetchTodaySleepHours = async (): Promise<number> => {
    const now = new Date();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { records } = await readRecords('SleepSession', {
        timeRangeFilter: {
            operator: 'between',
            startTime: startOfDay.toISOString(),
            endTime: now.toISOString(),
        },
    });

    const totalSleepMillis = records.reduce((sum, session) => {
        const start = new Date(session.startTime).getTime();
        const end = new Date(session.endTime).getTime();
        return sum + (end - start);
    }, 0);

    const totalSleepHours = totalSleepMillis / (1000 * 60 * 60);
    return parseFloat(totalSleepHours.toFixed(1));
};

// Fetch sleep data for the last 7 days
export const fetchWeeklySleepData = async (): Promise<{ date: string; hours: number }[]> => {
    const today = new Date();
    const weekData: { date: string; hours: number }[] = [];

    // Get data for the last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];

        const start = new Date(dateString);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        const { records } = await readRecords('SleepSession', {
            timeRangeFilter: {
                operator: 'between',
                startTime: start.toISOString(),
                endTime: end.toISOString(),
            },
        });

        const totalSleepMillis = records.reduce((sum, session) => {
            const start = new Date(session.startTime).getTime();
            const end = new Date(session.endTime).getTime();
            return sum + (end - start);
        }, 0);

        const totalSleepHours = parseFloat((totalSleepMillis / (1000 * 60 * 60)).toFixed(1));
        weekData.push({ date: dateString, hours: totalSleepHours });
    }

    return weekData;
};
