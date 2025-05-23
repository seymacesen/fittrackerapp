import { readRecords } from 'react-native-health-connect';
import type { HeartRateRecord } from 'react-native-health-connect';

export const fetchLatestHeartRate = async (): Promise<{ bpm: number; time: string } | null> => {
    const now = new Date();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Bugün 00:00

    // Health Connect'ten bugünkü tüm HeartRate kayıtlarını al
    const { records } = await readRecords<'HeartRate'>('HeartRate', {
        timeRangeFilter: {
            operator: 'between',
            startTime: startOfDay.toISOString(),
            endTime: now.toISOString(),
        },
    });

    if (!records || records.length === 0) return null;

    // Tüm örnekleri (samples) tek diziye aktar
    const allSamples = (records as HeartRateRecord[]).flatMap((record) => record.samples);

    if (allSamples.length === 0) return null;

    // Zaman sırasına göre sırala
    allSamples.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    const latest = allSamples[allSamples.length - 1];

    return {
        bpm: latest.beatsPerMinute,
        time: latest.time,
    };
};
