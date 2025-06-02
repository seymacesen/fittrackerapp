import { readRecords } from 'react-native-health-connect';
import type { HeartRateRecord, RestingHeartRateRecord } from 'react-native-health-connect';

// Günlük kalp atış verisi
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

// En son alınan BPM
export const fetchLatestHeartRate = async (): Promise<{ bpm: number; time: string } | null> => {
    const today = new Date().toISOString().split('T')[0];
    const samples = await fetchHeartRateSamplesByDate(today);
    if (!samples || samples.length === 0) return null;
    return samples[samples.length - 1];
};

// Dinlenme kalp atışı verisi
export const fetchRestingHeartRateByDate = async (
    selectedDate: string
): Promise<{ time: string; bpm: number }[]> => {
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const { records } = await readRecords<'RestingHeartRate'>('RestingHeartRate', {
        timeRangeFilter: {
            operator: 'between',
            startTime: start.toISOString(),
            endTime: end.toISOString(),
        },
    });

    const allSamples = (records as RestingHeartRateRecord[]).map((record) => ({
        bpm: record.beatsPerMinute,
        time: record.time,
    }));

    allSamples.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    return allSamples;
};

// En son dinlenme kalp atışı
export const fetchLatestRestingHeartRate = async (): Promise<{ bpm: number; time: string } | null> => {
    const today = new Date().toISOString().split('T')[0];
    const samples = await fetchRestingHeartRateByDate(today);
    if (!samples || samples.length === 0) return null;
    return samples[samples.length - 1];
};

// Günlük minimum bpm'i gece saatlerinde bul
export const estimateRestingHeartRate = (samples: { time: string; bpm: number }[]): number | null => {
    const nightSamples = samples.filter((s) => {
        const hour = new Date(s.time).getHours();
        // Gece 03:00 ile 06:00 arası örnekleri filtrele
        return hour >= 3 && hour < 7; // 06:59'a kadar dahil etmek için < 7 kullandım
    });

    if (nightSamples.length === 0) return null;

    const minBpm = Math.min(...nightSamples.map((s) => s.bpm));
    return minBpm;
};
