import { readRecords } from 'react-native-health-connect';
import type { HeartRateRecord } from 'react-native-health-connect';

export const fetchHeartRateSamplesByDate = async (
    selectedDate: string
): Promise<{ time: string; bpm: number }[]> => {
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const { records } = await readRecords<'HeartRate'>('HeartRate', {
        timeRangeFilter: {
            operator: 'between',
            startTime: start.toISOString(),
            endTime: end.toISOString(),
        },
    });

    const allSamples = (records as HeartRateRecord[]).flatMap((record) => record.samples);
    allSamples.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    return allSamples.map((sample) => ({
        bpm: sample.beatsPerMinute,
        time: sample.time,
    }));
};

export const fetchLatestHeartRate = async (): Promise<{ bpm: number; time: string } | null> => {
    const today = new Date().toISOString().split('T')[0];
    const samples = await fetchHeartRateSamplesByDate(today);
    if (!samples || samples.length === 0) return null;
    return samples[samples.length - 1];
};
