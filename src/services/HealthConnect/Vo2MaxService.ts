import { readRecords } from 'react-native-health-connect';
import type { Vo2MaxRecord } from 'react-native-health-connect';

export const fetchLatestVo2Max = async (): Promise<{ vo2: number; time: string } | null> => {
    const now = new Date();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // 1. Hata Düzeltimi: Generic tipi string olarak belirt
    const { records } = await readRecords<'Vo2Max'>('Vo2Max', {
        timeRangeFilter: {
            operator: 'between',
            startTime: startOfDay.toISOString(),
            endTime: now.toISOString(),
        },
    });

    if (!records.length) return null;

    // 2. Tarihe göre sıralama ekle
    const sortedRecords = records.sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    );

    const latest = sortedRecords[sortedRecords.length - 1];

    // 3. 'value' hatası düzeltimi
    return {
        vo2: latest.vo2MillilitersPerMinuteKilogram, // Direkt number değeri
        time: latest.time, // startTime YOK
    };
};