import { readRecords } from 'react-native-health-connect';

/**
 * Cihazın yerel saatine göre bugünün adım sayısını getirir.
 */
export const getTodaySteps = async (): Promise<number> => {
    const now = new Date();

    // Cihazın yerel saatine göre gün başlangıcı
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Türkiye saatiyle 00:00

    // ISO string'e çeviriyoruz ama bu UTC karşılığına dönüşür
    const startISO = startOfDay.toISOString();
    const endISO = now.toISOString();

    const { records } = await readRecords('Steps', {
        timeRangeFilter: {
            operator: 'between',
            startTime: startISO,
            endTime: endISO,
        },
    });

    // Adım sayılarını topla
    const total = records.reduce((sum, record: any) => sum + (record.count || 0), 0);
    return total;
};
