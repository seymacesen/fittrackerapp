import {
    readRecords,
    ActiveCaloriesBurnedRecord,
    TotalCaloriesBurnedRecord
} from 'react-native-health-connect';

export const fetchTodayCalories = async (): Promise<number> => {
    const now = new Date();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    try {
        const [activeResult, totalResult] = await Promise.all([
            readRecords('ActiveCaloriesBurned', {
                timeRangeFilter: {
                    operator: 'between',
                    startTime: startOfDay.toISOString(),
                    endTime: now.toISOString(),
                },
            }),
            readRecords('TotalCaloriesBurned', {
                timeRangeFilter: {
                    operator: 'between',
                    startTime: startOfDay.toISOString(),
                    endTime: now.toISOString(),
                },
            }),
        ]);

        const activeCalories = activeResult.records.reduce((sum, record) => {
            const energy = (record as unknown as ActiveCaloriesBurnedRecord).energy;
            if (!energy) return sum;

            const kcal =
                energy.unit === 'kilocalories'
                    ? energy.value
                    : energy.unit === 'joules'
                        ? energy.value / 4184
                        : 0;

            return sum + kcal;
        }, 0);

        const totalCalories = totalResult.records.reduce((sum, record) => {
            const energy = (record as unknown as TotalCaloriesBurnedRecord).energy;
            if (!energy) return sum;

            const kcal =
                energy.unit === 'kilocalories'
                    ? energy.value
                    : energy.unit === 'joules'
                        ? energy.value / 4184
                        : 0;

            return sum + kcal;
        }, 0);

        console.log(`🔥 Aktif: ${activeCalories.toFixed(1)} kcal, Toplam: ${totalCalories.toFixed(1)} kcal`);

        // En yüksek olanı al (Mi Fitness gibi davranır)
        return Math.round(Math.max(activeCalories, totalCalories));
    } catch (error) {
        console.error('❌ Kalori verisi alınamadı:', error);
        return 0;
    }
};

export const fetchCalorieSamplesByDate = async (
    selectedDate: string
): Promise<{ time: string; calories: number }[]> => {
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    try {
        const { records } = await readRecords('ActiveCaloriesBurned', {
            timeRangeFilter: {
                operator: 'between',
                startTime: start.toISOString(),
                endTime: end.toISOString()
            }
        });

        console.log('✅ ActiveCaloriesBurned Records:', records.length);

        const samples = records.map((record, index) => {
            const energy = (record as any).energy;
            const kcal = energy?.inKilocalories ?? 0;

            console.log(`🔸 Sample[${index}] = ${kcal.toFixed(2)} kcal at ${record.startTime}`);

            return {
                calories: Math.round(kcal * 10) / 10,
                time: record.startTime
            };
        });

        return samples.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    } catch (error) {
        console.error('❌ Error fetching calorie samples by date:', error);
        return [];
    }
};
