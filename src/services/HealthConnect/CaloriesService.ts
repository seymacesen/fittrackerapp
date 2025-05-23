import { readRecords, ActiveCaloriesBurnedRecord } from 'react-native-health-connect';

export const fetchTodayCalories = async (): Promise<number> => {
    const now = new Date();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    try {
        const { records } = await readRecords('ActiveCaloriesBurned', {
            timeRangeFilter: {
                operator: 'between',
                startTime: startOfDay.toISOString(),
                endTime: now.toISOString(),
            },
        });

        const totalCalories = records.reduce((sum, record) => {
            const energy = (record as unknown as ActiveCaloriesBurnedRecord).energy;
            if (!energy) return sum;

            // Birim kontrolü
            const joules = energy.unit === 'joules'
                ? energy.value
                : energy.unit === 'kilocalories'
                    ? energy.value * 4184
                    : 0;

            return sum + joules / 4184;
        }, 0);

        return Math.round(totalCalories);
    } catch (error) {
        console.error('Error fetching calorie data:', error);
        return 0;
    }
};