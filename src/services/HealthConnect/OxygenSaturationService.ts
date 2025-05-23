// src/services/HealthConnect/OxygenSaturationService.ts
import { readRecords } from 'react-native-health-connect';
import type { OxygenSaturationRecord } from 'react-native-health-connect';

export const fetchLatestOxygenSaturation = async (): Promise<{
    percentage: number;
    time: string;
} | null> => {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const { records } = await readRecords<'OxygenSaturation'>('OxygenSaturation', {
        timeRangeFilter: {
            operator: 'between',
            startTime: startOfDay.toISOString(),
            endTime: now.toISOString(),
        },
    });

    console.log('📦 Oxygen Records:', records);

    if (!records.length) return null;

    const latest = records[records.length - 1] as OxygenSaturationRecord;

    return {
        percentage: latest.percentage,
        time: latest.time ?? latest.time,
    };
};
