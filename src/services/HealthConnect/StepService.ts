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
