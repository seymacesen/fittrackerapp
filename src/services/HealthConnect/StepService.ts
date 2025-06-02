import { readRecords } from 'react-native-health-connect';

export const getTodaySteps = async (): Promise<number> => {
    const now = new Date();


    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);


    const startISO = startOfDay.toISOString();
    const endISO = now.toISOString();

    const { records } = await readRecords('Steps', {
        timeRangeFilter: {
            operator: 'between',
            startTime: startISO,
            endTime: endISO,
        },
    });

    const total = records.reduce((sum, record: any) => sum + (record.count || 0), 0);
    return total;
};

// Fetch daily step data for a given time range
export const fetchDailySteps = async (
    startTime: Date,
    endTime: Date
): Promise<{ date: string; steps: number }[]> => {
    const dailySteps: { [key: string]: number } = {};

    // Fetch all step records within the time range
    const { records } = await readRecords('Steps', {
        timeRangeFilter: {
            operator: 'between',
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
        },
    });

    // Aggregate steps by day
    records.forEach((record: any) => {
        const date = new Date(record.startTime);
        const dateString = date.toISOString().split('T')[0];

        dailySteps[dateString] = (dailySteps[dateString] || 0) + (record.count || 0);
    });

    // Convert aggregated data to desired format
    const result: { date: string; steps: number }[] = Object.keys(dailySteps).map(dateString => ({
        date: dateString,
        steps: dailySteps[dateString],
    }));

    // Sort by date
    result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return result;
};
