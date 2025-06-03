import { readRecords } from 'react-native-health-connect';
import dayjs from 'dayjs';

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

// Fetch step data in specified intervals for a single day
export const fetchStepsInIntervals = async (
    date: Date,
    intervalMinutes: number
): Promise<number[]> => {
    const startOfDay = dayjs(date).startOf('day');
    const endOfDay = dayjs(date).endOf('day');
    const stepsByInterval: number[] = [];
    const numberOfIntervals = (24 * 60) / intervalMinutes;

    for (let i = 0; i < numberOfIntervals; i++) {
        const intervalStart = startOfDay.add(i * intervalMinutes, 'minute');
        const intervalEnd = intervalStart.add(intervalMinutes, 'minute');

        // Ensure the end time does not go beyond the end of the day
        const currentIntervalEnd = intervalEnd.isAfter(endOfDay) ? endOfDay : intervalEnd;

        try {
            const { records } = await readRecords('Steps', {
                timeRangeFilter: {
                    operator: 'between',
                    startTime: intervalStart.toISOString(),
                    endTime: currentIntervalEnd.toISOString(),
                },
            });

            const totalStepsInInterval = records.reduce((sum, record: any) => sum + (record.count || 0), 0);
            stepsByInterval.push(totalStepsInInterval);
        } catch (error) {
            console.error(`Error fetching steps for interval ${intervalStart.toISOString()} - ${currentIntervalEnd.toISOString()}:`, error);
            stepsByInterval.push(0); // Add 0 steps in case of error
        }
    }

    return stepsByInterval;
};
