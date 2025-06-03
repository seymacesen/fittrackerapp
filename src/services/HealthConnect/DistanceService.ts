import { readRecords } from 'react-native-health-connect';
import type { DistanceRecord } from 'react-native-health-connect';
import dayjs from 'dayjs';

export const fetchTotalDistanceByDate = async (
    dateString: string
): Promise<number> => {
    try {
        const startOfDay = dayjs(dateString).startOf('day');
        const endOfDay = dayjs(dateString).endOf('day');

        const { records } = await readRecords<'Distance'>('Distance', {
            timeRangeFilter: {
                operator: 'between',
                startTime: startOfDay.toISOString(),
                endTime: endOfDay.toISOString(),
            },
        });

        // Sum up all distance records for the day in kilometers
        const totalDistanceInKm = records.reduce((sum, record) => {
            // Access distance directly as inKilometers
            return sum + (record.distance?.inKilometers ?? 0);
        }, 0);

        console.log(`Fetched total distance for ${dateString}: ${totalDistanceInKm.toFixed(2)} km`);

        return totalDistanceInKm;
    } catch (error) {
        console.error(`Error fetching distance data for ${dateString}:`, error);
        return 0; // Return 0 in case of error
    }
}; 