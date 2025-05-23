import { readRecords } from 'react-native-health-connect';

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
